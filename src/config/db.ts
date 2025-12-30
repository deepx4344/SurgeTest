import mongoose from "mongoose";
import logger from "../middlewares/logger.js";
import processConfig from "./env.js";
const connectDB = async () => {
  try {
    const MONGODBURI: string = processConfig.dbUrl!;
    await mongoose.connect(MONGODBURI);
    logger.info("MongoDB connected successfully");
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error("MongoDB connection error", err);
      process.exit(1);
    }
  }
};

export default connectDB;
