import logger from "../middlewares/logger.js";

const validateConfig = async (config: any): Promise<void> => {
  let notvalid: boolean = false;
  const keys = Object.keys(config) as Array<keyof typeof config>;
  keys.forEach((key) => {
    const check = config[key];
    if (check === undefined) {
      notvalid = true;
      logger.error(
        `FATAL: Could not resolve Env variable for "${key as string}"`
      );
    } else {
      if (typeof check !== "string") {
        validateConfig(check);
      }
    }
  });
  if (notvalid) {
    process.exit(1);
  }
};
export default validateConfig;
