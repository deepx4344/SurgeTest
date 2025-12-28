import { User,JWTPayLoadOutput } from "./index.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayLoadOutput;
    }
  }
}
