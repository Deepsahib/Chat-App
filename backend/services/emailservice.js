import nodemailer from 'nodemailer';
import { otpEmailTemplate } from '../templates/otp.template.js';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendEmailOtpController = async (email,otp) => {
  try {
    if (!email) {
      return {
        success: false,
        message: 'Email is required',
      };
    }

    const html = otpEmailTemplate(otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html,
    });

    return {
      success: true,
      message: 'OTP sent to email',
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};