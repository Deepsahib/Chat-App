import twilio from 'twilio';

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const serviceSid = process.env.SID;

const client = twilio(accountSid, authToken);

export const sendPhoneOTPController=async (req, res)=>{
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }

    const result = await sendPhoneOTPService(phoneNumber);

    return res.status(result.success ? 200 : 500).json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export const verifyOtpController = async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    // validation
    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        message: "Phone number aur OTP required hai",
      });
    }

    const result = await verifyOTP(phoneNumber, code);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "OTP verify ho gaya",
      });
    }

    return res.status(400).json({
      success: false,
      message: result.message || "Invalid OTP",
    });

  } catch (error) {
    console.error("Controller error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export async function verifyOTP(phoneNumber, code) {
  try {
    const response = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({
        to: phoneNumber,
        code: code
      });

    console.log('Verification status:', response.status);

    if (response.status === 'approved') {
      return { success: true };
    } else {
      return { success: false, message: 'Invalid OTP' };
    }

  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    return {
      success: false,
      message: error.message,
    };
  }
}

export const sendPhoneOTPService = async (phoneNumber) => {
  try {
    // Ensure E.164 format
    let formattedNumber = phoneNumber;

    if (!phoneNumber.startsWith("+")) {
      formattedNumber = `+91${phoneNumber}`;
    }

    const response = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: formattedNumber,
        channel: "sms",
      });

    return {
      success: true,
      message: "OTP sent successfully",
      sid: response.sid,
      status: response.status,
    };

  } catch (error) {
    console.error("Twilio Error:", error.message);

    return {
      success: false,
      message: error.message,
    };
  }
};