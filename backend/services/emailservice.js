import nodemailer from 'nodemailer';
import { otpEmailTemplate } from '../templates/otp.template.js';

const createTransporter = () =>
  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
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
    const transporter = createTransporter();

console.log('Email transporter configured with user:', process.env.EMAIL_USER);
console.log('Attempting to send OTP email to:', email);
   const info=await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html,
    });
console.log('Email sent successfully:', info);
    return {
      success: true,
      message: 'OTP sent to email',
    };

  } catch (error) {
      console.error("Email send error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};
