import twilio from 'twilio';

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const serviceSid = process.env.SID;

const client = twilio(accountSid, authToken);

// 📩 Function to send OTP
export async function sendPhoneOTP(phoneNumber) {
  try {
    const response = await client.verify.v2.services(serviceSid)
      .verifications
      .create({
        to: phoneNumber,
        channel: 'sms'
      });

    return {
      success: true,
      message: 'OTP sent successfully',
      data: response,
    };

  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return {
      success: false,
      message: error.message,
    };
  }
}

// 🔐 Function to verify OTP
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