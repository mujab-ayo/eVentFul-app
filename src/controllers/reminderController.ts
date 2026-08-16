import type { Request, Response } from "express";
import { createReminder } from "../services/reminderService.js"

export const createReminderController = async (req: Request, res: Response) => {
    try {
      const id = req.user?.id;

      if (!id) {
        return res.status(401).json("Unauthorized");
      }

      const eventId = req.params.id;

      if (typeof eventId !== "string") {
        return res.status(404).json("Event does not exist");
      }

      const { triggerMinutesBefore, channel } = req.body;

      if (typeof triggerMinutesBefore !== "number") {
        return res.status(400).json("Reminder must must be a number (minutes)");
      }

      if (!["email", "sms", "push"].includes(channel)) {
        return res
          .status(400)
          .json("Invalid channel. Must be 'email', 'sms', or 'push'");
      }

      const reminder = await createReminder(
        eventId,
        id,
        triggerMinutesBefore,
        channel,
      );

      return res.status(201).json(reminder);
    } catch (error) {
      if (error instanceof Error && error.message === "Event not found") {
        return res.status(404).json({ error: error.message });
      }

      if (
        error instanceof Error &&
        error.message === "Trigger time must be in the future"
      ) {
        return res.status(400).json({ error: error.message });
      }

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal Server Error" });
    }


}