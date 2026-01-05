import express, { Router } from "express";

import { startLoad } from "../controllers/load.js";

const router: Router = express.Router();

router.post("/start", startLoad);

export default router;
