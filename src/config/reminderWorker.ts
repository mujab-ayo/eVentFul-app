import { Worker } from "bullmq";
import redisClient from "./redis.js";
import Reminder from "../models/Reminder.js";

const reminderWorker = new Worker(
  "reminders",
  async (job) => {
    const { reminderId } = job.data;

    const reminder = await Reminder.findById(reminderId);

    if (!reminder) {
      console.log(`Reminder ${reminderId} no longer exists, skipping.`);
      return;
    }

    if (reminder.sent) {
      console.log(`Reminder ${reminderId} already sent, skipping.`);
      return;
    }

    // Stubbed "sending" logic — this is where a real email/SMS provider would go
    console.log(
      `Sending ${reminder.channel} reminder for event ${reminder.eventId} to user ${reminder.userId}`,
    );

    reminder.sent = true;
    await reminder.save();
  },
  { connection: redisClient },
);

reminderWorker.on("ready", () => {
  console.log("Reminder worker is ready and listening for jobs");
});

reminderWorker.on("active", (job) => {
  console.log(`Job ${job.id} has started processing`);
});

reminderWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

reminderWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

reminderWorker.on("error", (err) => {
  console.error("Worker-level error:", err);
});

export default reminderWorker;
