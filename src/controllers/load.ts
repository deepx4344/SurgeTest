import loadService from "../services/loadervice.js";
import asyncHandler from "../utils/async.js";

const load = new loadService();
export const startLoad = asyncHandler(async (req, res) => {
  await load.start(req.body);
});
