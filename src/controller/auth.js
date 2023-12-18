import { User } from "../db";
import logger from "../logger";
import { validationResult } from "express-validator";
import { checkPass } from "../utils/auth.utils";
import {
  generateResetToken,
  generateToken,
  verifyAuthToken,
  verifyResetToken,
} from "../utils/token.utils";
import { sendEmail } from "../utils/email.utils";

// user sign up route
export const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        success: false,
        data: errors.array(),
      });
    }
    const { file } = req;
    const { fName, lName, email, password, phone, role, bussiness } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User Already Exixts",
        success: false,
      });
    }

    const newUser = await User.create({
      fName,
      lName,
      email,
      password,
      phone,
      profilePicture: file?.location,
      role,
      bussiness,
    });

    return res.status(201).json({
      message: "User Created Successfully",
      data: newUser,
      success: true,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "!Internal Server Error",
      success: false,
    });
  }
};

// User sigin route
export const signIn = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        success: false,
        data: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User doesn't exists",
        success: false,
      });
    }
    const isMatch = await checkPass(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "! Invalid credientials",
        success: false,
      });
    }
    const tokenData = {
      id: user._id,
      email: user.email,
      role: user.role,
      initials: user.initials,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
    };
    const token = await generateToken(tokenData);
    return res.status(201).json({
      message: "Logged in successfully",
      success: true,
      data: {
        token,
        user: { user, initials: user.initials },
      },
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "!Internal Server Error",
      success: false,
    });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const resetToken = await generateResetToken({ email: user.email });

    const resetPassUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const subject = "Sole Sphere Password Reset";
    const emailInfo = {
      to: user.email,
      subject,
      text: resetPassUrl,
    };
    const info = await sendEmail(emailInfo);
    if (info === null) {
      return res.status(500).json({
        message: "Failed to send password reset email",
        success: false,
      });
    }
    user.tokens.push(resetToken);
    await user.save();
    return res.status(201).json({
      message: "reset url sent to your email address",
      success: true,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "!Internal Server Error",
      success: false,
    });
  }
};
// reset password
export const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        success: false,
        data: errors.array(),
      });
    }

    const { token } = req.params;
    const { password } = req.body;

    const decodeToken = await verifyResetToken(token);

    const { email } = decodeToken;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid Token",
        success: false,
      });
    }
    user.password = password;
    user.tokens = user.tokens.filter((t) => t !== token);
    await user.save();

    return res.status(201).json({
      message: "Password rest successful",
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "!Internal Server Error",
      success: false,
    });
  }
};

export const loadUser = async (req, res) => {
  try {
    const { token } = req.params;
    const decodeToken = await verifyAuthToken(token);
    if (!decodeToken) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
      });
    }
    return res.status(201).json({
      message: "Validated User Successfully",
      success: true,
      data: decodeToken,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "!Internal Server Error",
      success: false,
    });
  }
};
