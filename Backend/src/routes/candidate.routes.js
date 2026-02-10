import {verifyJWT} from "../middleware/auth.middleware.js";
import { Router } from "express";
import { forgotPassword, loginUser, logoutUser, registerUser, updatePassword ,updateProfilePhoto, verifyEmail } from "../controller/candidate.controller.js";
import {upload} from "../middleware/multer.middleware.js";

const router = Router();
router.route("/register").post(
    upload.fields([{ name: "profilePhoto", maxCount: 1 }]),
    registerUser
)

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);

router.route("/forget-password").post(forgotPassword);
router.route("/reset-password/:token").post(updatePassword)
router.route("/update-profile-photo").patch(
    verifyJWT,
    upload.single("profilePhoto"),
    updateProfilePhoto
); 

router.route("/verify-email/:verificationToken").get(verifyEmail);





export default router;