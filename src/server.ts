import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import processConfig from "./config/env.js";
import logger from "./middlewares/logger.js";
const port: number = Number(processConfig.port);

connectDB().then(() => {
  app.listen(port, () => {
    logger.info(`Server Started on port ${port}`);
  });
});
