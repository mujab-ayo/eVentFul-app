import { Queue } from "bullmq";
import redisClient from "./redis.js";


const reminderQueue = new Queue("reminderQueue", {
  connection: redisClient,
});

export default reminderQueue;