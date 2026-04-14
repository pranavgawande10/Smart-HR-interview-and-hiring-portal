import express from "express";
import { assignInterviewer ,getMatchedInterviewers , createInterviewRound , assignInterviewerToRound , getResumeForHR , updateHRCapacity, completeHRInterview,getShortlistedApplications,finalHRDecision, hrScheduleInterview,hrRescheduleInterview,getSelectedApplications, getHRInterviews} from "../controller/hr.controller.js";
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
  "/matched-interviewers/:applicationId/:interviewId",
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



router.get(
  "/resume/:applicationId",
  verifyJWT,
  authorizeRoles("HR"),
  getResumeForHR
);

router.patch(
  "/update-capacity",
  verifyJWT,
  authorizeRoles("HR"),
  updateHRCapacity
);

router.patch(
  "/complete-final/:interviewId",
  verifyJWT,
  authorizeRoles("HR"),
  completeHRInterview
);

router.get(
  "/shortlisted/:jobId",
  verifyJWT,
  authorizeRoles("HR"),
  getShortlistedApplications
);

router.patch(
  "/final-decision/:interviewId",
  verifyJWT,
  authorizeRoles("HR"),
  finalHRDecision
);

router.post(
  "/schedule/:interviewId",
  verifyJWT,
  authorizeRoles("HR"),
  hrScheduleInterview
);

router.put(
  "/reschedule/:interviewId",
  verifyJWT,
  authorizeRoles("HR"),
  hrRescheduleInterview
);

router.get(
  "/selected/:jobId",
  verifyJWT,
  authorizeRoles("HR"),
  getSelectedApplications
);

router.get(
  "/my-interviews",
  verifyJWT,
  authorizeRoles("HR"),
  getHRInterviews
);

export default router;