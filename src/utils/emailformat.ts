import logger from "../middlewares/logger.js";
import processConfig from "../config/env.js";
import { generateToken } from "./jwt.js";
import { JWTPayload } from "../types/index.js";
const emailFormat = async (
  payload: JWTPayload,
  key: string,
  duration: string
): Promise<{ html: string; text: string } | undefined> => {
  try {
    const token: string = await generateToken(payload, key, duration);
    const uriFormat: string = `http://${processConfig.HOST}/api/verify/${token}`;
    const appName: string = processConfig.name || "SurgeTest";

    const htmlFormat = `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${appName} - Verify your email</title>
      </head>
      <body style="font-family: Arial, Helvetica, sans-serif; background-color:#f6f9fc; margin:0; padding:0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.08);">
                <tr>
                  <td style="padding:24px; text-align:center; background:linear-gradient(90deg,#1a73e8,#4285f4); color:#fff;">
                    <h1 style="margin:0; font-size:20px;">${appName}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px; color:#1f2937;">
                    <h2 style="font-size:18px; margin:0 0 12px;">Verify your email address</h2>
                    <p style="margin:0 0 16px; color:#374151; line-height:1.5;">Thanks for trying ${appName}! Click the button below to verify your email and complete setup.</p>

                    <p style="text-align:center; margin:28px 0;">
                      <a href="${uriFormat}" style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:6px; font-weight:600;">Verify email</a>
                    </p>

                    <p style="color:#6b7280; font-size:13px; line-height:1.4;">If the button doesn't work, copy and paste the following link into your browser:</p>
                    <p style="word-break:break-all; color:#6b7280; font-size:13px;">${uriFormat}</p>

                    <hr style="border:none; border-top:1px solid #e6eef8; margin:24px 0;" />
                    <p style="font-size:12px; color:#9ca3af; margin:0;">This link will expire in the time specified in the verification email (if applicable). If you didn't request this email, you can safely ignore it.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 24px; background:#f3f6fb; color:#9ca3af; font-size:12px; text-align:center;">
                    <div>${appName} • ${processConfig.HOST}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    const textFormat = `${appName} - Verify your email\n\nThanks for trying ${appName}!\n\nCopy and paste the link below into your browser to verify your email:\n\n${uriFormat}\n\nIf you did not request this, you can safely ignore this email.\n\nThis link will expire in ${duration}.\n\n${appName} • ${processConfig.HOST}`;

    return { html: htmlFormat, text: textFormat };
  } catch (e) {
    logger.error("Error from genToken and Format", { error: e });
    return;
  }
};
export default emailFormat;
