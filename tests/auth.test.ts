import "dotenv/config";
import { jest, describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

const data = {
  email: "adegokeanthony23@gmail.com",
  password: "Babylon.!1",
};

const { default: app } = await import("../src/app.js");
const { default: connectDB } = await import("../src/config/db.js");

beforeAll(async () => {
  await connectDB();
  if (mongoose.connection.db) {
    await mongoose.connection.db
      .collection("users")
      .deleteMany({ email: "adegokeanthony23@gmail.com" });
  }
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db
      .collection("users")
      .deleteMany({ email: "adegokeanthony23@gmail.com" });
  }
  await mongoose.disconnect();
});

describe("Post /api/auth/", () => {
  it("should complete the registration flow", async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data);
    expect(registerResponse.status).toBe(201);

    const verifyResponse = await request(app)
      .get(`/api/auth/verify/${registerResponse.body.token}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(verifyResponse.status).toBe(302);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data);
    expect(loginResponse.status).toBe(200);
  });
});
