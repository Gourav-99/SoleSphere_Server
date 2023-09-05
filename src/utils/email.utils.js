import nodemailer from "nodemailer";
import logger from "../logger";

// Create a transporter instance
const transporter = nodemailer.createTransport({
  // Configure your email service here (e.g., Gmail)
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send an email
export const sendEmail = async (emailInfo) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: emailInfo.to,
    subject: emailInfo.subject,
    text: emailInfo.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.log("Email sent:", info.response);
    return info;
  } catch (error) {
    logger.error("Error sending email:", error);
    return null;
  }
};
