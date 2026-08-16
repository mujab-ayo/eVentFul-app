import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js"

import redisClient from "./config/redis.js";
import "./config/reminderWorker.js";
import rateLimit from "express-rate-limit";

import express from "express";
const app = express();
const PORT = process.env.PORT || 5000;


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, 
  message: { error: "Too many attempts, please try again later." },
});


app.use(limiter);

app.use(express.json());

app.get("/health", (req, res) => {
  res.send({ status: "ok" });
});

app.use("/auth", authLimiter, authRoutes);

app.use("/events", eventRoutes);

app.use("/orders", orderRoutes);

app.use("/tickets", ticketRoutes)

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
