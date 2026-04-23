import express from "express";
import {updateAvailability , updateCapacity , updateSkills, completeInterview , scheduleInterview,rescheduleInterview, getMyInterviews, getProfile} from "../controller/interviewer.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.patch("/availability", verifyJWT, authorizeRoles("INTERVIEWER"),updateAvailability);
router.patch("/capacity", verifyJWT,authorizeRoles("INTERVIEWER"), updateCapacity);
router.patch("/complete-interview/:interviewId", verifyJWT, authorizeRoles("INTERVIEWER"), completeInterview);
router.post("/schedule/:interviewId", verifyJWT, authorizeRoles("INTERVIEWER"), scheduleInterview);
router.put("/reschedule/:interviewId", verifyJWT, authorizeRoles("INTERVIEWER"), rescheduleInterview);
router.patch("/skills", verifyJWT, authorizeRoles("INTERVIEWER"), updateSkills);
router.get("/my-interviews", verifyJWT, authorizeRoles("INTERVIEWER"), getMyInterviews);
router.get("/profile", verifyJWT, authorizeRoles("INTERVIEWER"), getProfile);

export default router; 