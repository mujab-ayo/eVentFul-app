import connectDB from "./config/db.js";
import redisClient from "./config/redis.js";
import "./config/reminderWorker.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
