import {createEvent, getAllEvents} from "../services/eventService.js";
import type { Request, Response } from "express";

export const createEventController = async (req: Request, res: Response) => {
  try {
    const eventData = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const id = req.user.id;

    const createdEvent = await createEvent(eventData, id);

    res.status(201).json(createdEvent);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllEventsController = async (req: Request, res: Response) => {
    try {
        const events = await getAllEvents();

        return res.status(200).json(events);
      


    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
}
