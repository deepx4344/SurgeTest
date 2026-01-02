import express, { Router } from "express";

import { register, login, verify } from "../controllers/auth.js";
import { registerSchema, loginSchema } from "../validations/auth.js";
import { validateSchema } from "../middlewares/joiValidation.js";
import { authlimiter } from "../middlewares/rateLimit.js";
const router: Router = express.Router();

router.post("/register", authlimiter, validateSchema(registerSchema), register);
router.post("/login", authlimiter, validateSchema(loginSchema), login);
router.get("/verify/:token", verify);

export default router;
