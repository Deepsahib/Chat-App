import { sendEmailOtpController } from "../services/emailservice.js";
import { generateOtp } from "../utilis/otpGenerator.js";
import User from "../models/userschema.js";
import { errorResponse, successResponse } from "../utilis/serverResponse.js";
import { generateJwtToken } from "../utilis/jwtgenerate.js";
export const sendOtpController = async (req, res) => {
 
    try {
        const { email } = req.body;
        // ❌ Email required
        if (!email) {
            return errorResponse(res, "Email is required", 400);
        }

        const otp = generateOtp();
        let user = await User.findOne({ email });
        if (user && user.isVerified) {
            return errorResponse(res, "User already verified", 400);
        }

        // ✅ Create user if not exists
        if (!user) {
            user = new User({ email });
        }

        // ✅ Save OTP
        user.emailOtp = otp;
        user.emailOtpExpiry = Date.now() + 5 * 60 * 1000;

        await user.save()
        const emailResult = await sendEmailOtpController(email, otp);

        if (!emailResult.success) {
            return errorResponse(res, emailResult.message, 500);
        }

        return successResponse(res, "OTP sent to email", 200, {
            email,
        });

    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal server error", 500);
    }
};

export const verifyEmailOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return errorResponse(res, "Email and OTP are required", 400);
        }

        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, "User with this email not found", 404);
        }

        if (!user.emailOtp || !user.emailOtpExpiry) {
            return errorResponse(res, "No email OTP found for this user", 400);
        }

        if (Date.now() > Number(user.emailOtpExpiry)) {
            return errorResponse(res, "Email OTP has expired", 400);
        }

        if (user.emailOtp !== otp.toString()) {
            return errorResponse(res, "Invalid email OTP", 400);
        } 
        user.emailOtp = undefined;
        user.emailOtpExpiry = undefined;
        user.isVerified = true;
        await user.save();

        const token = generateJwtToken(user._id);

        res.cookie("token", token, { httpOnly: true });
        return successResponse(res, "Email OTP verified successfully", 200, {
            email: user.email,
            isVerified: user.isVerified,
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const updateProfile=async(req,res)=>{
    const {userName,agreed,about} = req.body;
    const userId=req.user;
    try {
        const user=await User.findById(userId);
        const file=req.file;
        if(file){
            const uploadResult=await uploadImage(file.path);
            user.profilePicture=uploadResult.secure_url;
        }
        if(userName) user.userName=userName;
        if(about) user.about=about;
        if(agreed!==undefined) user.agreed=agreed;
        await user.save();
        return successResponse(res,"Profile updated successfully",200,user);
    } catch (error) {
        return errorResponse(res,error.message,500);
    }
}

export const logout=async(req,res)=>{
try {
    res.cookie("token","",{
        httpOnly:true,
        expires:new Date(0)
    });
    return successResponse(res,"Logged out successfully",200);
} catch (error) {
    return errorResponse(res,error.message,500);
}
}

export const checkauthenctication=async(req,res)=>{
    try {
        const userId=req.user;  
        const user=await User.findById(userId);
        if(!user){
            return errorResponse(res,"User not found",404);
        }
        return successResponse(res,"User authenticated",200,user);
    } catch (error) {
        return errorResponse(res,error.message,500);
    }
}
