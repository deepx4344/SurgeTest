import AuthService from "./authService.js";
import asyncHandler from "../utils/async.js";
import { createAPIResponse } from "../utils/index.js";
import { ApiResponseinput } from "../types/index.js";
const auth = new AuthService();

export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  auth.register(email, password);
  const dataToSend: ApiResponseinput = {
    success: true,
    message: "User Created Successfully",
  };
  return res.status(201).json(createAPIResponse(dataToSend));
});
