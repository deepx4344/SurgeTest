import AuthService from "../services/authService.js";
import asyncHandler from "../utils/async.js";
import { createAPIResponse } from "../utils/index.js";
import { ApiResponseinput, Tokens } from "../types/index.js";
import cookieOptions from "../utils/cookie.js";
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
  res.cookie("tokens", tokens, cookieOptions);

  return res.status(200).json(createAPIResponse(dataToSend));
});

export const verify = asyncHandler(async (req, res) => {
  const token = req.params.token;
  await auth.verify(token);
  return res.status(200).end();
});

export const logout = asyncHandler(async (req, res) => {
  const tokens: Tokens = req.signedCookies["tokens"];
  const accessToken: string = tokens.accessToken;
  await auth.logout(accessToken);
  res.clearCookie("tokens", cookieOptions);
  res.status(204).end();
});

export const refresh = asyncHandler(async (req, res) => {
  const tokens: Tokens = req.signedCookies["tokens"];
  const newToken: string = await auth.refresh(tokens.refreshToken);
  tokens.accessToken = newToken;
  res.cookie("tokens", tokens, cookieOptions);
  res.status(200).end();
});

export const me = asyncHandler(async (req, res) => {
  const user = req.user;
  const userData = await auth.me(user.id);
  const dataToSend: ApiResponseinput = {
    success: true,
    message: "User data retrieved Successfully",
    user: userData,
  };
  res.status(200).json(createAPIResponse(dataToSend));
});
