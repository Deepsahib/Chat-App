import { Router } from "express";
import {
	sendOtpController,
	updateProfile,
	verifyEmailOtpController,
	checkauthenctication,
	logout,
} from "../controller/authcontroller.js";
import { sendPhoneOTPController, verifyOtpController } from "../services/twilioservice.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyEmailOtpController);
router.post("/send-phone-otp", sendPhoneOTPController);
router.post("/verify-phone-otp", verifyOtpController);
router.post("/update-profile", authMiddleware,upload.single("profilePicture"), updateProfile);
router.get("/check-authentication", authMiddleware, checkauthenctication);
router.post("/logout", authMiddleware, logout);

export default router;
