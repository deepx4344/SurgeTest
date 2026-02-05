import "dotenv/config";
import { jest, describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

jest.unstable_mockModule("../../src/services/emailService.js", () => ({
  verificationEmail: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
}));

const testEmail = `auth+${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
const testPassword = "Babylon.!1";

const { default: app } = await import("../../src/app.js");
const { default: connectDB } = await import("../../src/config/db.js");
const { default: Users } = await import("../../src/models/users.js");
const { default: processConfig } = await import("../../src/config/env.js");
const { generateToken } = await import("../../src/utils/jwt.js");

const registerUser = async () => {
  const registerResponse = await request(app)
    .post("/api/auth/register")
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .send({ email: testEmail, password: testPassword });

  expect(registerResponse.status).toBe(201);
  return registerResponse;
};

const verifyUser = async () => {
  const user = await Users.findOne({ email: testEmail }).lean();
  expect(user).toBeTruthy();

  const verifyKey = processConfig.JWTs.verifyEmail.key;
  const verifyDuration = processConfig.JWTs.verifyEmail.duration;

  expect(verifyKey).toBeTruthy();
  expect(verifyDuration).toBeTruthy();

  const token = await generateToken(
    {
      id: user!._id.toString(),
      email: user!.email,
      paid: user!.paid,
    },
    verifyKey!,
    verifyDuration!,
  );

  const verifyResponse = await request(app)
    .get(`/api/auth/verify/${token}`)
    .set("Accept", "application/json");

  expect(verifyResponse.status).toBe(200);
  return verifyResponse;
};

const loginUser = async () => {
  const loginResponse = await request(app)
    .post("/api/auth/login")
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .send({ email: testEmail, password: testPassword });

  expect(loginResponse.status).toBe(200);
  return loginResponse;
};

beforeAll(async () => {
  await connectDB();
  if (mongoose.connection.db) {
    await mongoose.connection.db
      .collection("users")
      .deleteMany({ email: testEmail });
  }
},20000);

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db
      .collection("users")
      .deleteMany({ email: testEmail });
  }
  await mongoose.disconnect();
},20000);

describe("Auth routes", () => {
  it("registers a new user", async () => {
    const registerResponse = await registerUser();
    expect(registerResponse.body).toMatchObject({
      success: true,
      message: "User Created Successfully",
    });

    const user = await Users.findOne({ email: testEmail }).lean();
    expect(user).toBeTruthy();
    expect(user?.verified).toBe(false);
  });

  it("verifies a registered user", async () => {
    await verifyUser();

    const verifiedUser = await Users.findOne({ email: testEmail }).lean();
    expect(verifiedUser?.verified).toBe(true);
  });

  it("logs in a verified user", async () => {
    const loginResponse = await loginUser();
    expect(loginResponse.body).toMatchObject({
      success: true,
      message: "User Logged In Successfully",
    });
    expect(loginResponse.headers["set-cookie"]).toBeDefined();
  });
});
