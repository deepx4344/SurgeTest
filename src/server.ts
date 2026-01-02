import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import processConfig from "./config/env.js";
import logger from "./middlewares/logger.js";
import validateConfig from "./config/validenv.js";
const port: number = Number(processConfig.port);

validateConfig(processConfig).then(() => {
  logger.info("Config Checked Successfully");
  connectDB().then(() => {
    app.listen(port, () => {
      logger.info(`Server Started on port ${port}`);
    });
  });
});
