import express, { Router } from "express";

import { startLoad } from "../controllers/load.js";
import { validateSchema } from "../middlewares/joiValidation.js";
import { loadSchema } from "../validations/load.js";

const router: Router = express.Router();

router.post("/start", validateSchema(loadSchema), startLoad);

export default router;
