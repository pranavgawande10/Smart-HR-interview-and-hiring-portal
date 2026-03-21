import jwt from "jsonwebtoken";

// const User = require("../../../server/src/models/user");
// import  User  from "../../../server/src/models/user.cjs";
import User from "../models/user.cjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { upload } from "../middleware/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  emailVerificationMailgenContent,
  sendEmail,
  passwordResetMailgenContent,} from "../utils/mail.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import Interview from "../models/interview.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(400, "User is Not Registered!!!");
    }

    const accessTokens = user.getJWT();
    // const refreshTokens = user.generateRefreshToken();

    // user.refreshToken = refreshTokens;

    await user.save({ validateBeforeSave: false });
    return {accessTokens};
  } catch (error) {
       console.log("REAL ERROR:", error); 
    throw new ApiError(
      500,
      "Something went wrong whle generating access and refresh tokens",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
<<<<<<< HEAD
  const { email, name, password , role} = req.body;

  if ([email, name, password , role].some((field) => !field?.trim())) {
=======
  const { email, name, password } = req.body;
 
  if ([email, name, password].some((field) => !field?.trim())) {
>>>>>>> 691fa71 (connect frontend to server)
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [ { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  // const profilePhotoLocalPath = req.files?.profilePhoto?.[0]?.path;
  // if (!profilePhotoLocalPath) {
  //   throw new ApiError(400, "Profile Photo is required");
  // }

  // // Upload to Cloudinary
  // let profilePhoto;
  // try {
  //   profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);
  //   if (!profilePhoto?.url) {
  //     throw new ApiError(500, "Cloudinary did not return a valid URL");
  //   }
  //   console.log("Profile Photo uploaded to Cloudinary:", profilePhoto.url);
  // } catch (error) {
  //   console.log("Cloudinary upload error:", error);
  //   throw new ApiError(500, "Failed to upload Profile Photo");
  // }



  // Create user
  const user = await User.create({
    email,
    name,
    password : passwordHash,
    role,
    // profilePhoto: profilePhoto.url,
  });

  // const { unHashedToken, hashedToken, tokenExpiry } =
  //   user.generateTemporaryToken();

  // user.emailVerificationToken = hashedToken;
  // user.emailVerificationTokenExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  // await sendEmail({
  //   email: user.email,
  //   subject: "Please verify your mail",
  //   mailgenContent: emailVerificationMailgenContent(
  //     user.name,
  //     `${req.protocol}://${req.get("host")}/api/v1/candidates/verify-email/${unHashedToken}`,
  //   ),
  // });

  const createdUser = await User.findById(user._id).select(
    "-password",
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
  const { email, password, role } = req.body;

  if ([email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  if (role && user.role !== role) {
    throw new ApiError(403, "Access denied for this role");
  }

  const isPasswordValid = await user.validatePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid email or password");
  }

  const accessToken = user.getJWT();

  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, {
        message: "User Logged In Successfully",
        user: loggedInUser,
        role: user.role,
        accessToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged Out Successfully"));

});

// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   if ([email].some((field) => !field?.trim())) {
//     throw new ApiError(400, "Email feild is required");
//   }

//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new ApiError(400, "User of this Email is not registered yet");
//   }

//   const { unHashedToken, hashedToken, tokenExpiry } =
//     user.generateTemporaryToken();

//   user.forgotPasswordToken = hashedToken;
//   user.forgotPasswordTokenExpiry = tokenExpiry;

//   await user.save({ validateBeforeSave: false });

//   const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/candidates/reset-password/${unHashedToken}`;

//   await sendEmail({
//     email: user.email,
//     subject: "Please Reset your Password",
//     mailgenContent: passwordResetMailgenContent(user.name, resetUrl),
//   });

//   return res.send(200).json(200, "Reset Email sent Successfully");
// });

// const updatePassword = asyncHandler(async (req, res) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   if ([newPassword].some((field) => !field?.trim())) {
//     throw new ApiError(400, "Password fields are required");
//   }

//   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//   const user = await User.findOne({
//     forgotPasswordToken: hashedToken,
//     forgotPasswordTokenExpiry: { $gt: Date.now() },
//   });

//   if (!user) {
//     throw new ApiError(400, "Invalid reset password Link");
//   }

//   user.password = newPassword;
//   user.forgotPasswordToken = undefined;
//   user.forgotPasswordTokenExpiry = undefined;

//   await user.save({ validateBeforeSave: false });

//   return res.status(200).json(new ApiResponse(200, "Password Updated Successfully"));
// });

const updateProfilePhoto = asyncHandler(async (req, res) => {
  const profilePhotoLocalPath = req.file?.path;
  if (!profilePhotoLocalPath) {
    throw new ApiError(400, "Profile Photo is required");
  }

  const profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);

  if (!profilePhoto?.url) {
    throw new ApiError(500, "Cloudinary did not return a valid URL");
  }

  const user = await User.findByIdAndUpdate(
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

// const verifyEmail = asyncHandler(async (req, res) => {
//   const { verificationToken } = req.params;

//   let hashedToken = crypto
//     .createHash("sha256")
//     .update(verificationToken)
//     .digest("hex");
//   console.log("Received Token:", verificationToken);
//   console.log("Hashed Version:", hashedToken);

//   const user = await User.findOne({
//     emailVerificationToken: hashedToken,
//     emailVerificationTokenExpiry: { $gt: Date.now() },
//   });

//   if (!user) {
//     return res.status(400).send("Invalid or expired verification link");
//   }

//   user.isEmailVerified = true;
//   user.emailVerificationToken = undefined;
//   user.emailVerificationExpiry = undefined;

//   await user.save({ validateBeforeSave: false });

//   return res.send("<h3>Email verified successfully ✅</h3>");
// });


const changePassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    throw new ApiError(400, "feilds is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User with this email does not exist");
  }
  const isPasswordValid = await user.validatePassword(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Old password is incorrect");
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = newHashedPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Password reset successfully. You can now log in with your new password.",
      ),
    );
}); 

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password",
  );

  const data = {
    name: user.name,
    email: user.email,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Current User Fetched Successfully"));
});

export {
  registerUser,
  generateAccessAndRefreshTokens,
  loginUser,
  logoutUser,
  getCurrentUser,
  changePassword,
  updateProfilePhoto,
};



export const respondToInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { response, reason } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    interview.candidateResponse = response;

    if (response === "REQUEST_RESCHEDULE") {
      interview.rescheduleReason = reason;
    }

    if (response === "REJECTED") {
      interview.status = "CANCELLED";
    }

    await interview.save();

    res.json({
      message: "Response submitted",
      interview
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




