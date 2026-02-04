import { CookieOptions } from "express";
import processConfig from "../config/env.js";

const cookieOptions: CookieOptions = {
  signed: Boolean(processConfig.cookie.key),
  maxAge:
    parseInt(processConfig.JWTs.refresh.duration!, 10) * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: processConfig.enviroment === "production",
  sameSite: "lax",
};

export default cookieOptions;
