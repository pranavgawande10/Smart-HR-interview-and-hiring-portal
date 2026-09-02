import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";
import { getAllJobs , getJobById} from "../controller/job.controller.js";

const router = Router();

router.route("/all-jobs").get(getAllJobs);
router.get("/:jobId", getJobById);

export default router;