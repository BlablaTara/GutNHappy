import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gutnhappy@gmail.com",
    pass: "itkioprzskfjdyad",
  },
});

export async function sendNewPassword(to, resetLink) {
  const mailOptions = {
    from: "gutnhappy@gmail.com",
    to,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetLink}`,
    html: `<p>Click the following link toreset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
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
