import jwt from "jsonwebtoken";
import logger from "../logger";
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.AUTH_SECRET, {
    expiresIn: "1d",
  });
};
export const verifyAuthToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.AUTH_SECRET);
    return payload;
  } catch (error) {
    logger.error(error);
    return null;
  }
};
export const generateResetToken = (payload) => {
  return jwt.sign(payload, process.env.RESET_SECRET, {
    expiresIn: "1d",
  });
};
export const verifyResetToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.RESET_SECRET);
    return payload;
  } catch (error) {
    logger.error(error);
    return null;
  }
};
