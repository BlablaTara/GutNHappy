import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendNewPassword(to, resetLink) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetLink}`,
    html: `<p>Click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true };
  } catch (error) {
    console.log("Error sending email: ", error);
    return { success: false, error: error.message };
  }
}
