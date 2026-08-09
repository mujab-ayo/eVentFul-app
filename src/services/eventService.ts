import { type EventInput } from "../types/event.js";
import Event from "../models/Event.js";

const createEvent = async (eventData: EventInput, creatorId: string) => {
  const event = await Event.create({
    ...eventData,
    createdBy: creatorId,
    collaborators: [{ userId: creatorId, isOwner: true }],
  });

  return event;
};

const getAllEvents = async () => {
  const events = await Event.find();
  return events;
};

const getEventById = async (eventId: string) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

const updateEvent = async (
  eventId: string,
  userId: string,
  updateData: Partial<EventInput>,
) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event does not exist");
  }

  const eventAccess =
    event.createdBy.toString() === userId ||
    event.collaborators.some((collab) => collab.userId?.toString() === userId);

  if (!eventAccess) {
    throw new Error("Not authorized to update this event");
  }

  Object.assign(event, updateData);

  await event.save();

  return event;
};

const deleteEvent = async (eventId: string, id: string) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event does not exist");
  }

  const eventAccess =
    event.createdBy.toString() === id ||
    event.collaborators.some((collab) => collab.userId?.toString() === id);

  if (!eventAccess) {
    throw new Error("Not authorized to delete this event");
  }

  await Event.findByIdAndDelete(eventId);

  return { message: "Event deleted successfully" };
};

export { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
