export const otpEmailTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px;">
        
        <h2 style="text-align: center; color: #333;">🔐 OTP Verification</h2>
        
        <p style="font-size: 16px; color: #555;">
          Your One-Time Password (OTP) is:
        </p>

        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #000;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #777;">
          This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.
        </p>

        <hr style="margin: 20px 0;" />

        <p style="font-size: 12px; color: #aaa; text-align: center;">
          If you didn’t request this, you can safely ignore this email.
        </p>

      </div>
    </div>
  `;
};