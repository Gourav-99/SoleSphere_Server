import logger from "../logger";

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// Set up OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  // "YOUR_CLIENT_ID",
  process.env.OAUTH_CLIENT_ID,
  // "YOUR_CLIENT_SECRET",
  process.env.OAUTH_CLIENT_SECRET,
  // "YOUR_REDIRECT_URI "
  process.env.OAUTH_REDIRECT_URL
);

// Set the access token
oAuth2Client.setCredentials({
  access_token: process.env.OAUTH_ACCESS_TOKEN,
});

// Create the transporter using OAuth2 authentication
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "goupg1999@gmail.com",
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    accessToken: oAuth2Client.getAccessToken(),
  },
});

export const sendEmail = async (emailInfo) => {
  try {
    // Compose the email
    const mailOptions = {
      from: "goupg1999@gmail.com",
      to: emailInfo.to,
      subject: emailInfo.subject,
      text: emailInfo.text,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    logger.info("Email sent:", info.response);
    return info;
  } catch (error) {
    logger.error("Error sending email:", error);
    return null;
  }
};
