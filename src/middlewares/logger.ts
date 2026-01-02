import winston from "winston";
import fs from "fs";
import path from "path";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const LogDirectoryPath = path.join(import.meta.dirname, "..", "logs");
const errorLogPath = path.join(LogDirectoryPath, "error.log");
const infoLogPath = path.join(LogDirectoryPath, "info.log");

if (!fs.existsSync(LogDirectoryPath)) {
  fs.mkdirSync(LogDirectoryPath);
}

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.File({ filename: infoLogPath, level: "info" }),
    new winston.transports.File({ filename: errorLogPath, level: "error" }),
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

export default logger;
