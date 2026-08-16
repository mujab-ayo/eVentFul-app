import type { Request, Response } from "express";
import { getEventAnalytics, getMyEventsAnalytics } from "../services/analyticsService.js";

export const getEventAnalyticsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = req.user?.id;

    if (!id) {
      return res.status(401).json("Unauthorized");
    }

    const eventId = req.params.id;

    if (typeof eventId !== "string") {
      return res.status(404).json("Event does not exist");
    }

    const analytics = await getEventAnalytics(eventId, id);

    return res.status(200).json(analytics);
  } catch (error) {
    if (error instanceof Error && error.message === "Event not found") {
      return res.status(404).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Not authorized to view orders for this event"
    ) {
      return res.status(403).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMyEventsAnalyticsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = req.user?.id;

    if (!id) {
      return res.status(401).json("Unauthorized");
    }

    const result = await getMyEventsAnalytics(id);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



