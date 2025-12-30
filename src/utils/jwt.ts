import { JWTPayload } from "../types/index.js";
import jwt, { JwtPayload, SignOptions} from "jsonwebtoken";

export const generateToken = async (
  payload: JWTPayload,
  key: string,
  duration: string
): Promise<string> => {
  
  const options: SignOptions = {
    expiresIn: duration as any,
  };
  const token: string = jwt.sign(payload, key, options);
  return token;
};
export const verifyToken = async (
  token: string,
  key: string
): Promise<JwtPayload> => {
  const verified: JwtPayload = jwt.verify(token, key) as JwtPayload;
  return verified;
};
