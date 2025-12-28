import mongoose from "mongoose";
import logger from "../middlewares/logger.js";
const connectDB = async () => {
  try {
    const MONGODBURI: string = process.env["mongoURI"]!;
    await mongoose.connect(MONGODBURI);
    logger.info("MongoDB connected successfully");
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error("MongoDB connection error", err.message);
      process.exit(1);
    }
  }
};

export default connectDB;
