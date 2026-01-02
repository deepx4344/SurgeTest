import nodemailer from "nodemailer";
import { verificationEmailFormat } from "../utils/emailformat.js";
import logger from "../middlewares/logger.js";
import { JWTPayload } from "../types/index.js";
import processConfig from "../config/env.js";
import { createServiceError } from "../utils/index.js";

export const verificationEmail = async (
  to: string,
  payload: JWTPayload,
  key: string,
  duration: string
): Promise<string> => {
  let format;
  try {
    format = await verificationEmailFormat(payload, key, duration);
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
    transporter.verify(function (error, success) {
      if (error) {
        logger.error(`Connection Error: ${error}`);
      } else {
        logger.info("Server is ready to send messages.");
      }
    });
  } catch (e) {
    logger.error("Error from send Emails", { error: e });
    throw createServiceError("SomeThing Went Wrong", 503);
  } finally {
    return format?.token as string;
  }
};
