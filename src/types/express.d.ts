import { User,JWTPayload } from "./index.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayLoad;
    }
  }
}
