import loadService from "../services/loadService.js";
import { ApiResponseinput } from "../types/index.js";
import asyncHandler from "../utils/async.js";
import { createAPIResponse } from "../utils/index.js";

const load = new loadService();

export const startLoad = asyncHandler(async (req, res) => {
  const config = req.body;
  const testId = await load.createTest(config);
  const dataToSend: ApiResponseinput = {
    success: true,
    message: "Task created successfully",
    data: testId,
  };
  res.status(202).json(createAPIResponse(dataToSend));
});
