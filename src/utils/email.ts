import nodemailer from "nodemailer";
import emailFormat from "./emailformat.js";
import logger from "../middlewares/logger.js";
import { JWTPayload } from "../types/index.js";
import processConfig from "../config/env.js";
import { createServiceError } from "./index.js";

export const verificationEmail = async (
  to: string,
  payload: JWTPayload,
  key: string,
  duration: string
) => {
  try {
    let format = await emailFormat(payload, key, duration);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: processConfig.mailer.user,
        pass: processConfig.mailer.pass,
      },
    });
    await transporter.sendMail({
      from: `verify@${processConfig.name}.com`,
      to: to,
      subject: "Verify Your Email",
      html: format?.html,
      text: format?.text,
    });
    try {
      transporter.verify(function (error, success) {
        if (error) {
          logger.error(`Connection Error: ${error}`);
        } else {
          logger.info("Server is ready to send messages.");
        }
      });
    } catch (e) {
      logger.error("Error from transporter verify", { error: e });
      throw createServiceError("Something Went Error", 502);
    }
  } catch (e) {
    logger.error("Error from send Emails", { error: e });
  }
};
