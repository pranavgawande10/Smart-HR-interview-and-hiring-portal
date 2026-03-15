import express from "express";
import {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} from "../controller/application.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Candidate Routes

router.post(
  "/apply/:jobId",
  verifyJWT,
  authorizeRoles("CANDIDATE"),
  upload.single("resume"),   
  applyForJob
);

router.get(
  "/my-applications",
  verifyJWT,
  authorizeRoles("CANDIDATE"),
  getMyApplications
);


// HR Routes
router.get(
  "/job/:jobId",
  verifyJWT,
  authorizeRoles("HR"),
  getApplicantsForJob
);

router.patch(
  "/status/:applicationId",
  verifyJWT,
  authorizeRoles("HR"),
  updateApplicationStatus
);

export default router;