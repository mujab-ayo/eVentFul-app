
import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";

const runId = Date.now();
const email = `test-integration-auth-${runId}@example.com`;
const password = "password123";

describe("POST /auth/register", () => {
  afterAll(async () => {
    await User.deleteMany({ email: { $regex: /^test-integration-auth-/ } });
  });

  it("registers a new user and returns 201 without leaking the password hash", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Integration Test User",
      email,
      password,
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(email);
    expect(res.body.hashedPassword).toBeUndefined();
    expect(res.body.password).toBeUndefined();
  });

  it("rejects a duplicate registration with 400", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Integration Test User",
      email,
      password,
    });

    expect(res.status).toBe(400);
  });
});

describe("POST /auth/login", () => {
    it("logs in successfully and returns a token", async () => {
      console.log("LOGIN RESPONSE:", res.status, res.body);
    const res = await request(app)
      .post("/auth/login")
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(email);
  });

  it("rejects login with wrong password using 401", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email, password: "wrongpassword" });

    expect(res.status).toBe(401);
  });
});

describe("GET /auth/me (protected route)", () => {
  it("rejects requests with no Authorization header (401)", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });

  it("rejects requests with a garbage token (401)", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer not-a-real-token");

    expect(res.status).toBe(401);
  });

  it("accepts a valid token and returns the decoded user", async () => {
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password });
    const token = loginRes.body.token;

    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("id");
  });
});
