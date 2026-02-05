import express, { Express } from "express";
import morgan from "morgan";
import compression from "compression";
import path from "path";
import cookieParser from "cookie-parser";

import processConfig from "./config/env.js";
import errormiddleWare from "./middlewares/error.js";
import authRoutes from "./routes/auth.js";
import loadRoutes from "./routes/load.js";
import authMiddleware from "./middlewares/auth.js";
const publicPath = path.join(import.meta.dirname, "..", "public", "build");
const app: Express = express();
const development: boolean = processConfig.enviroment === "development";

// app.set("trust proxy", true);

if (development) {
  app.use(morgan("dev"));
}
app.use(compression());
app.use(cookieParser(processConfig.cookie.key));

app.use(express.static(publicPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use("/api/load", authMiddleware, loadRoutes);

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(publicPath, "index.html"));
});

app.use(errormiddleWare);
export default app;
