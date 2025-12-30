import AuthService from "./authService.js";
import asyncHandler from "../utils/async.js";
import { createAPIResponse } from "../utils/index.js";
import { ApiResponseinput } from "../types/index.js";
import processConfig from "../config/env.js";
const auth = new AuthService();

export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  await auth.register(email, password);
  const dataToSend: ApiResponseinput = {
    success: true,
    message: "User Created Successfully",
  };
  return res.status(201).json(createAPIResponse(dataToSend));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const token: string = await auth.login(email, password);
  const dataToSend: ApiResponseinput = {
    success: true,
    message: "User Logged In Successfully",
    token: token,
  };
  res.cookie("token", token, {
    signed: processConfig.cookie.key? true : false,
    maxAge: parseInt(processConfig.JWTs.duration!, 10) * 60 * 1000,
    httpOnly: true,
    secure: processConfig.enviroment === "production",
    sameSite:"lax"
  });
  return res.status(200).json(createAPIResponse(dataToSend));
});

export const verify = asyncHandler(async (req, res) => {
  const token = req.params.token;
  await auth.verify(token);
  return res.redirect("/login");
});
