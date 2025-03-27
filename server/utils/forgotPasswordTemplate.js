const forgotPasswordTemplate = (name, otp) => {
    return `<p>Hi ${name},</p> <p>Your OTP is:</p><br>
    <div style="text-align: center; font-size: 24px; font-weight: bold; background: yellow; padding: 20px;">${otp}</div><br>
    <p>This otp is valid only for 5 minutes</p><br>
    <p>Best regards,<br>MyStore Team</p>`;
}

export default forgotPasswordTemplate