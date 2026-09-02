// import { Candidate } from "../models/candidate.model.js";
import User from "../models/user.cjs";
import jwt from "jsonwebtoken";

import { ApiError } from "../utils/api-error.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  let token;

  // ✅ Check header first (most specific, sent explicitly by frontend)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // ✅ Fallback to cookies
  else if (req.cookies?.accessToken && req.cookies.accessToken !== "null") {
    token = req.cookies.accessToken;
  } else if (req.cookies?.token && req.cookies.token !== "null") {
    token = req.cookies.token; // fallback (old)
  }

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ success: false, message: "You are not logged in!" });
  }

  try {
    console.log("verifyJWT - Extracted Token:", token);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verifyJWT - Decoded Token:", decodedToken);

    const user = await User.findById(decodedToken._id).select("-password");
    console.log("verifyJWT - Found User:", user ? { _id: user._id, name: user.name, role: user.role } : "None");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("verifyJWT - Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid access token: " + error.message });
  }
});