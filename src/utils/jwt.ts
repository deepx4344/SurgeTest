import { JWTPayload } from "../types/index.js";
import jwt, { SignOptions } from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError } = jwt;

import logger from "../middlewares/logger.js";
import { createServiceError } from "./index.js";

export const generateToken = async (
  payload: JWTPayload,
  key: string,
  duration: string
): Promise<string> => {
  const options: SignOptions = {
    expiresIn: duration as any,
  };
  let token: string;
  try {
    token = jwt.sign(payload, key, options);
  } catch (err: unknown) {
    if (err instanceof JsonWebTokenError) {
      throw createServiceError("Invalid Token", 401);
    } else if (err instanceof TokenExpiredError) {
      throw createServiceError("Token Expired", 401);
    } else {
      logger.error(err);
      throw createServiceError("Something went wrong", 500);
    }
  }
  return token;
};
export const verifyToken = async (
  token: string,
  key: string
): Promise<JWTPayload> => {
  let verified: JWTPayload;
  try {
    verified = jwt.verify(token, key) as JWTPayload;
  } catch (err: unknown) {
    if (err instanceof JsonWebTokenError) {
      throw createServiceError("Invalid Token", 401);
    } else if (err instanceof TokenExpiredError) {
      throw createServiceError("Token Expired", 401);
    } else {
      logger.error(err);
      throw createServiceError("Something went wrong", 500);
    }
  }
  return verified;
};
