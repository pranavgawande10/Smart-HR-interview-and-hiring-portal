import express from "express";
import { assignInterviewer ,getMatchedInterviewers , createInterviewRound , assignInterviewerToRound, hrDecisionAfterInterview , getResumeForHR} from "../controller/hr.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post(
  "/assign-interviewer/:applicationId",
  verifyJWT,
  authorizeRoles("HR"),
  assignInterviewer
);

router.get(
  "/matched-interviewers/:applicationId",
  verifyJWT,
  authorizeRoles("HR"),
  getMatchedInterviewers
);


router.post(
  "/create-round/:applicationId",
  verifyJWT,
  authorizeRoles("HR"),
  createInterviewRound
);

// ✅ 2. Assign Interviewer to Specific Round
router.put(
  "/assign-round/:interviewId",
  verifyJWT,
  authorizeRoles("HR"),
  assignInterviewerToRound
);

router.post(
  "/hr-decision/:interviewId",
  verifyJWT,
  authorizeRoles("HR"),
  hrDecisionAfterInterview
);

router.get(
  "/resume/:applicationId",
  verifyJWT,
  authorizeRoles("HR"),
  getResumeForHR
);

export default router;