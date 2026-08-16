
import "dotenv/config";
import mongoose from "mongoose";
import { beforeAll, afterAll } from "vitest";

beforeAll(async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined — cannot run tests without a database",
    );
  }

 
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
