import Undici from "undici";

import Tests from "../models/load.js";

class loadService {
  createTest = async (configs: any): Promise<string> => {
    const test = new Tests({
      ...configs
    });
    const savedTests = await test.save()
    return savedTests._id.toString();
  };
}

export default loadService;
