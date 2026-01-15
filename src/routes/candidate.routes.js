import {verifyJWT} from "../middleware/auth.middleware.js";
import { Router } from "express";
import { loginUser, registerUser } from "../controller/candidate.controller.js";
import {upload} from "../middleware/multer.middleware.js";

const router = Router();
router.route("/register").post(
    upload.fields([{ name: "profilePhoto", maxCount: 1 }]),
    registerUser
)

router.route("/login").post(loginUser);

export default router;