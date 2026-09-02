import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateProfilePhoto,
  changePassword,
  getCurrentUser,
  respondToInterview,
  getMyInterviews,
  requestRescheduleCandidate,
  updateProfile,
  getJobById,
  resetPassword,
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

// Reset Password
router.post("/reset-password", resetPassword);

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
router.patch(
  "/respond/:interviewId",
  verifyJWT,
  authorizeRoles("CANDIDATE"),
  respondToInterview
);

// Get My Interviews
router.get(
  "/my-interviews",
  verifyJWT,
  authorizeRoles("CANDIDATE"),
  getMyInterviews
);

router.patch("/request-reschedule/:interviewId", verifyJWT, authorizeRoles("CANDIDATE"), requestRescheduleCandidate);
router.get("/job/:jobId", verifyJWT, authorizeRoles("CANDIDATE"), getJobById);

router.put(
  "/profile",
  verifyJWT,
  authorizeRoles("CANDIDATE"),
  updateProfile
);


export default router;