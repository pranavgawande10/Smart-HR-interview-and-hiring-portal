import jwt from "jsonwebtoken";
import { Candidate } from "../models/candidate.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { upload } from "../middleware/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  emailVerificationMailgenContent,
  sendEmail,
  passwordResetMailgenContent,
} from "../utils/mail.js";
import crypto from "crypto";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await Candidate.findById(userId);

    if (!user) {
      throw new ApiError(400, "User is Not Registered!!!");
    }

    const accessTokens = user.generateAccessToken();
    const refreshTokens = user.generateRefreshToken();

    user.refreshToken = refreshTokens;

    await user.save({ validateBeforeSave: false });
    return { accessTokens, refreshTokens };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong whle generating access and refresh tokens",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  if ([email, name, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await Candidate.findOne({
    $or: [{ name }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User with Name or Email already exists");
  }

  const profilePhotoLocalPath = req.files?.profilePhoto?.[0]?.path;
  if (!profilePhotoLocalPath) {
    throw new ApiError(400, "Profile Photo is required");
  }

  // Upload to Cloudinary
  let profilePhoto;
  try {
    profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);
    if (!profilePhoto?.url) {
      throw new ApiError(500, "Cloudinary did not return a valid URL");
    }
    console.log("Profile Photo uploaded to Cloudinary:", profilePhoto.url);
  } catch (error) {
    console.log("Cloudinary upload error:", error);
    throw new ApiError(500, "Failed to upload Profile Photo");
  }

  // Create user
  const user = await Candidate.create({
    email,
    name,
    password,
    profilePhoto: profilePhoto.url,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user.email,
    subject: "Please verify your mail",
    mailgenContent: emailVerificationMailgenContent(
      user.name,
      `${req.protocol}://${req.get("host")}/api/v1/candidates/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await Candidate.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, "Unable to create User");
  }

  res.status(201).json(
    new ApiResponse(201, {
      message: "User Registered Successfully",
      user: createdUser,
    }),
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await Candidate.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid email or password");
  }

  const { accessTokens, refreshTokens } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await Candidate.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Unable to login User");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "Production",
  };

  res
    .status(200)
    .cookie("refreshToken", refreshTokens, options)
    .cookie("accessToken", accessTokens, options)
    .json(
      new ApiResponse(200, {
        message: "User Logged In Successfully",
        user: { loggedInUser, accessTokens, refreshTokens },
      }),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await Candidate.findByIdAndUpdate(
    req.candidate._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "Production",
  };

  res
    .status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged Out Successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if ([email].some((field) => !field?.trim())) {
    throw new ApiError(400, "Email feild is required");
  }

  const user = await Candidate.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User of this Email is not registered yet");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordTokenExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/candidates/reset-password/${unHashedToken}`;

  await sendEmail({
    email: user.email,
    subject: "Please Reset your Password",
    mailgenContent: passwordResetMailgenContent(user.name, resetUrl),
  });

  return res.send(200).json(200, "Reset Email sent Successfully");
});

const updatePassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if ([newPassword].some((field) => !field?.trim())) {
    throw new ApiError(400, "Password fields are required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await Candidate.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid reset password Link");
  }

  user.password = newPassword;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, "Password Updated Successfully"));
});

const updateProfilePhoto = asyncHandler(async (req, res) => {
  const profilePhotoLocalPath = req.file?.path;
  if (!profilePhotoLocalPath) {
    throw new ApiError(400, "Profile Photo is required");
  }

  const profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);

  if (!profilePhoto?.url) {
    throw new ApiError(500, "Cloudinary did not return a valid URL");
  }

  const user = await Candidate.findByIdAndUpdate(
    req.candidate?._id,
    {
      $set: {
        profilePhoto: profilePhoto.url,
      },
    },
    {
      new: true,
    },
  ).select("-password -refreshToken");

  res.status(200).json(
    new ApiResponse(200, {
      message: "Profile Photo Updated Successfully",
      user,
    }),
  );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  console.log("Received Token:", verificationToken);
  console.log("Hashed Version:", hashedToken);

  const user = await Candidate.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send("Invalid or expired verification link");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  return res.send("<h3>Email verified successfully ✅</h3>");
});

export {
  registerUser,
  generateAccessAndRefreshTokens,
  loginUser,
  logoutUser,
  updatePassword,
  updateProfilePhoto,
  verifyEmail,
  forgotPassword
};
