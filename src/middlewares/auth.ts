import asyncHandler from "../utils/async.js";
import processConfig from "../config/env.js";
import { createServiceError } from "../utils/index.js";
import { verifyToken } from "../utils/jwt.js";
import { JWTPayload, Tokens } from "../types/index.js";
import { checkIfBlackListed } from "../utils/blackList.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const signedCookiesToken: Tokens = req.signedCookies["tokens"];
  if (!signedCookiesToken || !signedCookiesToken.accessToken) {
    throw createServiceError("Invalid Token", 401);
  }
  const accessToken: string = signedCookiesToken.accessToken;
  const checkBlackListed: boolean = await checkIfBlackListed(accessToken);
  if (checkBlackListed) {
    throw createServiceError("Invalid Token", 401);
  }
  const valid: JWTPayload = (await verifyToken(
    accessToken,
    processConfig.JWTs.access.key!
  )) as JWTPayload;
  if (!valid) {
    throw createServiceError("Unauthoried", 401);
  }
  req.user = valid;
  return next();
});

export default authMiddleware;
