import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";
import { getAllJobs } from "../controller/job.controller.js";

const router = Router();

router.route("/all-jobs").get(getAllJobs);

export default router;