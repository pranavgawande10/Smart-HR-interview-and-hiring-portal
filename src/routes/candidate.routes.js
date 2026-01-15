import {verifyJWT} from "../middleware/auth.middleware.js";
import { Router } from "express";
import { loginUser, logoutUser, registerUser, updatePassword } from "../controller/candidate.controller.js";
import {upload} from "../middleware/multer.middleware.js";

const router = Router();
router.route("/register").post(
    upload.fields([{ name: "profilePhoto", maxCount: 1 }]),
    registerUser
)

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);

router.route("/forget-password").post(verifyJWT , updatePassword);


export default router;