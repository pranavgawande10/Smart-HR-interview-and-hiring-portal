import jwt from "jsonwebtoken";
import { Candidate } from "../models/candidate.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { upload } from "../middleware/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
      "Something went wrong whle generating access and refresh tokens"
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

  const createdUser = await Candidate.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Unable to create User");
  }

  res.status(201).json(
    new ApiResponse(201, {
      message: "User Registered Successfully",
      user: createdUser,
    })
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
    user._id
  );

  const loggedInUser = await Candidate.findById(user._id).select(
    "-password -refreshToken"
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
      })
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
    }
  );

  const options = {
    htttpOnly: true,
    secure: process.env.NODE_ENV === "Production",
  };

  res
    .status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(
      new ApiResponse(200, "User Logged Out Successfully")
    );
});

const updatePassword = asyncHandler(async (req, res) => {
  const {oldPassword, newPassword} = req.body;
  
  const user = await Candidate.findById(req.candidate?._id);

  if ([oldPassword, newPassword].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const isPasswordValid = await user.comparePassword(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Old Password is incorrect");
  }


  user.password = newPassword;
  await user.save({validateBeforeSave: false});

  res.status(200).json(
    new ApiResponse(200, "Password Updated Successfully")
  )
})

export { registerUser, generateAccessAndRefreshTokens, loginUser, logoutUser, updatePassword };
