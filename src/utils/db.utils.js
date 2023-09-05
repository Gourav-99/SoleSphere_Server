import mongoose from "mongoose";
import logger from "../logger";

const connectDB = async () => {
  try {
    const DB_URL = process.env.DB_URL_SOLE;

    await mongoose.connect(DB_URL, {});
    logger.warn("Connected to DB");
  } catch (error) {
    logger.error(error);
  }
};
export default connectDB;
