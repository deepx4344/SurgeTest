import { rateLimit } from "express-rate-limit";

export const authlimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many requests, Try again later",
});
