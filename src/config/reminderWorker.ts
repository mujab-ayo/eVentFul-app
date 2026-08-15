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

export default reminderWorker;
