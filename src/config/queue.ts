import { Queue } from "bullmq";
import redisClient from "./redis.js";


const reminderQueue = new Queue("reminders", {
  connection: redisClient,
});

export default reminderQueue;