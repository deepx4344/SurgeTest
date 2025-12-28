import express, { Express } from "express";
import morgan from "morgan";
import path from "path";
import processConfig from "./config/env.js";
const publicPath = path.join(import.meta.dirname, "..", "public");
const app: Express = express();
const development: boolean = processConfig.enviroment === "development";

if (development) {
  app.use(morgan("dev"));
}
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
