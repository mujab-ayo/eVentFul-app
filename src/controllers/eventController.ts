import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../services/eventService.js";
import type { Request, Response } from "express";

export const createEventController = async (req: Request, res: Response) => {
  try {
    const eventData = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const id = req.user.id;

    const createdEvent = await createEvent(eventData, id);

    return res.status(201).json(createdEvent);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllEventsController = async (req: Request, res: Response) => {
  try {
    const events = await getAllEvents();

    return res.status(200).json(events);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEventByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string" || !id.trim()) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const event = await getEventById(id);
    return res.status(200).json(event);
  } catch (error) {
    if (error instanceof Error && error.message === "Event not found") {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateEventController = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;

    if (!id) {
      return res.status(401).json("unauthorized");
    }

    const eventId = req.params.id;

    if (typeof eventId !== "string") {
      return res.status(404).json("event not found");
    }
    const updateData = req.body;

    const result = await updateEvent(eventId, id, updateData);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Event does not exist") {
      return res.status(404).json({ error: error.message });
    }
    if (
      error instanceof Error &&
      error.message === "Not authorized to update this event"
    ) {
      return res.status(403).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteEventController = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;

    if (!id) {
      return res.status(401).json("unauthorized");
    }

    const eventId = req.params.id;

    if (typeof eventId !== "string") {
      return res.status(404).json("event not found");
    }

    const del = await deleteEvent(eventId, id);

    return res.status(200).json(del);
  } catch (error) {
     if (error instanceof Error && error.message === "Event does not exist") {
      return res.status(404).json({ error: error.message });
    }
    if (
      error instanceof Error &&
      error.message === "Not authorized to delete this event"
    ) {
      return res.status(403).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
  }

