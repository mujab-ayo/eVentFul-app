import { getEventById } from "./eventService.js";
import Reminder from "../models/Reminder.js";
import reminderQueue from "../config/queue.js";

export const createReminder = async (
  eventId: string,
  userId: string,
  triggerMinutesBefore: number,
  channel: "email" | "sms" | "push",
) => {
  const event = await getEventById(eventId);

  const triggerTime =
    new Date(event.startDate).getTime() - triggerMinutesBefore * 60 * 1000;
  const delay = triggerTime - Date.now();

  if (delay <= 0) {
    throw new Error("Trigger time must be in the future");
  }

  const reminder = await Reminder.create({
    eventId,
    userId,
    triggerMinutesBefore,
    channel,
  });

  await reminderQueue.add(
    "send-reminder",
    {
      reminderId: reminder._id.toString(),
    },
    {
      delay,
    },
  );

  return reminder;
};
