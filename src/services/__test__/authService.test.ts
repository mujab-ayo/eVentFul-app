
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import User from "../../models/User.js";
import { registerUser, loginUser } from "../authService.js";


const runId = Date.now();
const testEmail = `test-auth-${runId}@example.com`;
const testPassword = "password123";

describe("authService", () => {
  afterAll(async () => {

    await User.deleteMany({ email: { $regex: /^test-auth-/ } });
  });

  describe("registerUser", () => {
    it("creates a new user with a hashed password (not plaintext)", async () => {
      const user = await registerUser("Test User", testEmail, testPassword);

      expect(user).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.name).toBe("Test User");


      expect(user.hashedPassword).not.toBe(testPassword);
     
      expect(user.hashedPassword).toMatch(/^\$2[aby]\$/);
    });

    it("throws an error when registering with an email that already exists", async () => {
    
      await expect(
        registerUser("Duplicate User", testEmail, testPassword),
      ).rejects.toThrow("User already exists");
    });
  });

  describe("loginUser", () => {
    it("logs in successfully with correct credentials and returns a token + user", async () => {
      const result = await loginUser(testEmail, testPassword);

      expect(result).toHaveProperty("token");
      expect(typeof result.token).toBe("string");
      expect(result.user.email).toBe(testEmail);
    });

    it("rejects login with a wrong password using a generic error message", async () => {
      await expect(loginUser(testEmail, "wrongPassword123")).rejects.toThrow(
        "Invalid Credentials",
      );
    });

    it("rejects login for an email that was never registered, with the SAME generic message (no user-enumeration leak)", async () => {
      await expect(
        loginUser("nobody-such-user@example.com", "whatever123"),
      ).rejects.toThrow("Invalid Credentials");
    });
  });
});
