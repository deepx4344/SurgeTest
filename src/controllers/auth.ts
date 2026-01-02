import AuthService from "../services/authService.js";
import asyncHandler from "../utils/async.js";
import { createAPIResponse } from "../utils/index.js";
import { ApiResponseinput, Tokens } from "../types/index.js";
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
  const tokens: Tokens = await auth.login(email, password);
  const dataToSend: ApiResponseinput = {
    success: true,
    message: "User Logged In Successfully",
  };
  res.cookie("token", tokens, {
    signed: Boolean(processConfig.cookie.key),
    maxAge:
      parseInt(processConfig.JWTs.refresh.duration!, 10) * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: processConfig.enviroment === "production",
    sameSite: "lax",
  });
  return res.status(200).json(createAPIResponse(dataToSend));
});

export const verify = asyncHandler(async (req, res) => {
  const token = req.params.token;
  await auth.verify(token);
  return res.redirect("/login");
});
export const logout = asyncHandler(async (req, res) => {
  const tokens: Tokens = req.signedCookies["tokens"];
  const accessToken: string = tokens.accessToken;
  await auth.logout(accessToken);
  res.clearCookie("tokens", {
    signed: Boolean(processConfig.cookie.key),
  });
});
