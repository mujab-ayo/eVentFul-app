import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  addCollaborator,
  toggleCollaboratorOwner,
  removeCollaborator
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
};

export const addCollaboratorController = async (
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

    const newCollaboratorId = req.body.userId;

    const result = await addCollaborator(eventId, id, newCollaboratorId);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Event does not exist") {
      return res.status(404).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Only owners can add collaborators"
    ) {
      return res.status(403).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "User is already a collaborator"
    ) {
      return res.status(409).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const toggleCollaboratorController = async (
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

    const targetUserId = req.params.userId;

    if (typeof targetUserId !== "string") {
      return res.status(404).json("Event does not exist");
    }

    const result = await toggleCollaboratorOwner(eventId, id, targetUserId);

    return res.status(201).json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "This user is not a collaborator"
    ) {
      return res.status(404).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Only owners can add collaborators"
    ) {
      return res.status(403).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Cannot demote the last remaining owner"
    ) {
      return res.status(409).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const removeCollaboratorController = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;

    if (!id) {
      return res.status(401).json("Unauthorized");
    }

    const eventId = req.params.id;

    if (typeof eventId !== "string") {
      return res.status(404).json("Event does not exist");
    }

    const targetUserId = req.params.userId;

    if (typeof targetUserId !== "string") {
      return res.status(404).json("Event does not exist");
    }

    const result = await removeCollaborator(eventId, id, targetUserId);

    return res.status(201).json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "This user is not a collaborator"
    ) {
      return res.status(404).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Only owners can add collaborators"
    ) {
      return res.status(403).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Cannot delete the last remaining owner"
    ) {
      return res.status(409).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};