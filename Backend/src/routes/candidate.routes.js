import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateProfilePhoto,
  changePassword,
  getCurrentUser,
  respondToInterview
} from "../controller/candidate.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

// Register
router.post(
  "/register",
  upload.fields([{ name: "profilePhoto", maxCount: 1 }]),
  registerUser
);

// Login
router.post("/login", loginUser);

// Change Password (🔒 FIXED)
router.patch(
  "/change-password",
  verifyJWT,
  authorizeRoles("CANDIDATE"),
  changePassword
);

// Logout
router.post(
  "/logout",
  verifyJWT,
  authorizeRoles("CANDIDATE"),
  logoutUser
);

// Update Profile Photo
router.patch(
  "/update-profile-photo",
  verifyJWT,
  authorizeRoles("CANDIDATE"),
  upload.single("profilePhoto"),
  updateProfilePhoto
);

// Current User
router.get(
  "/current-user",
  verifyJWT,
  authorizeRoles("CANDIDATE"),
  getCurrentUser
);

// Respond to Interview (🔥 MAIN FEATURE)
router.put(
  "/interview/respond/:interviewId",
  verifyJWT,
  authorizeRoles("CANDIDATE"),
  respondToInterview
);

export default router;