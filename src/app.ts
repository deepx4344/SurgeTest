import express, { Express } from "express";
import morgan from "morgan";
import compression from "compression";
import path from "path";
import cookieParser from "cookie-parser";
import processConfig from "./config/env.js";
import errormiddleWare from "./middlewares/error.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middlewares/auth.js";
const publicPath = path.join(import.meta.dirname, "..", "public");
const app: Express = express();
const development: boolean = processConfig.enviroment === "development";

if (development) {
  app.use(morgan("dev"));
}
app.use(compression());
app.use(cookieParser(processConfig.cookie.key));

// Prevent 404 noise from browsers requesting /favicon.ico by returning our SVG favicon
app.get("/favicon.ico", (req, res) => {
  return res.sendFile(path.join(publicPath, "favicon.svg"));
});

app.use(
  express.static(publicPath, {
    etag: true,
    maxAge: 31536000000,
    setHeaders: (res, pathName) => {
      if (pathName.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      } else {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use(authMiddleware);


app.use(errormiddleWare);
export default app;
