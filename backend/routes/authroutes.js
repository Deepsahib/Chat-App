import { Router } from "express";
import {
	sendOtpController,
	verifyEmailOtpController,
} from "../controller/authcontroller.js";

const router = Router();

router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyEmailOtpController);
router.post("/verify-email-otp", verifyEmailOtpController);

export default router;
