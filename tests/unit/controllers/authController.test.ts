import { jest, describe, it, expect } from "@jest/globals";

const registerMock = jest.fn<any>().mockResolvedValue(undefined);
const loginMock = jest.fn<any>().mockResolvedValue({
  accessToken: "access-token",
  refreshToken: "refresh-token",
});
const verifyMock = jest.fn<any>().mockResolvedValue(undefined);
const logoutMock = jest.fn<any>().mockResolvedValue(undefined);
const refreshMock = jest.fn<any>().mockResolvedValue("new-access-token");
const meMock = jest.fn<any>().mockResolvedValue({
  id: "user-id",
  email: "user@example.com",
  paid: false,
});

const AuthServiceMock = jest.fn().mockImplementation(() => ({
  register: registerMock,
  login: loginMock,
  verify: verifyMock,
  logout: logoutMock,
  refresh: refreshMock,
  me: meMock,
}));

jest.unstable_mockModule("../../../src/services/authService.js", () => ({
  default: AuthServiceMock,
}));

const authController = await import("../../../src/controllers/auth.js");

const createRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

const flushPromises = async () =>
  await new Promise((resolve) => setTimeout(resolve, 0));

describe("Auth controller", () => {
  it("registers a user", async () => {
    const req: any = { body: { email: "user@example.com", password: "Pass.!1" } };
    const res = createRes();
    const next = jest.fn();

    authController.register(req, res, next);
    await flushPromises();

    expect(registerMock).toHaveBeenCalledWith("user@example.com", "Pass.!1");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("logs in a user and sets cookie", async () => {
    const req: any = { body: { email: "user@example.com", password: "Pass.!1" } };
    const res = createRes();
    const next = jest.fn();

    authController.login(req, res, next);
    await flushPromises();

    expect(loginMock).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith(
      "tokens",
      expect.objectContaining({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      }),
      expect.any(Object),
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("verifies a user", async () => {
    const req: any = { params: { token: "token" } };
    const res = createRes();
    const next = jest.fn();

    authController.verify(req, res, next);
    await flushPromises();

    expect(verifyMock).toHaveBeenCalledWith("token");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
  });

  it("refreshes access token", async () => {
    const tokens = { accessToken: "old", refreshToken: "refresh" };
    const req: any = { signedCookies: { tokens } };
    const res = createRes();
    const next = jest.fn();

    authController.refresh(req, res, next);
    await flushPromises();

    expect(refreshMock).toHaveBeenCalledWith("refresh");
    expect(res.cookie).toHaveBeenCalledWith(
      "tokens",
      expect.objectContaining({ accessToken: "new-access-token" }),
      expect.any(Object),
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
  });

  it("returns the current user", async () => {
    const req: any = { user: { id: "user-id" } };
    const res = createRes();
    const next = jest.fn();

    authController.me(req, res, next);
    await flushPromises();

    expect(meMock).toHaveBeenCalledWith("user-id");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("logs out a user", async () => {
    const req: any = { signedCookies: { tokens: { accessToken: "access" } } };
    const res = createRes();
    const next = jest.fn();

    authController.logout(req, res, next);
    await flushPromises();

    expect(logoutMock).toHaveBeenCalledWith("access");
    expect(res.clearCookie).toHaveBeenCalledWith("tokens", expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });
});
