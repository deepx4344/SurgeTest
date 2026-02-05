import express, { Router } from "express";

import { register, login, verify, logout, me } from "../controllers/auth.js";
import { registerSchema, loginSchema } from "../validations/auth.js";
import { validateSchema } from "../middlewares/joiValidation.js";
import { authlimiter } from "../middlewares/rateLimit.js";
import authMiddleware from "../middlewares/auth.js";
const router: Router = express.Router();

router.post("/register", authlimiter, validateSchema(registerSchema), register);
router.post("/login", authlimiter, validateSchema(loginSchema), login);
router.get("/verify/:token", verify);
router.post("/logout",authMiddleware, logout);
router.get("/me", authMiddleware, me);

export default router;
