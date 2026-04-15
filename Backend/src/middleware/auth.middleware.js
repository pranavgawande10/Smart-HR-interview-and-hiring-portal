// import { Candidate } from "../models/candidate.model.js";
import User from "../models/user.cjs";
import jwt from "jsonwebtoken";

import { ApiError } from "../utils/api-error.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  let token;

  // ✅ Check cookies (both old + new)
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.cookies?.token) {
    token = req.cookies.token; // fallback (old)
  }

  // ✅ Check header
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "You are not logged in!");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken._id).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();

  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});