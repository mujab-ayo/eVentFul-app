import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js"

import express from "express";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.send({ status: "ok" });
});

app.use("/auth", authRoutes);

app.use("/events", eventRoutes);

app.use("/orders", orderRoutes);

app.use("/tickets", ticketRoutes)

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
