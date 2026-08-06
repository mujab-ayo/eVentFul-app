import { type EventInput } from "../types/event.js";
import Event from "../models/Event.js";

const createEvent = async (eventData: EventInput, creatorId: string) => {

  const event = await Event.create({
    ...eventData,
    createdBy: creatorId, collaborators: [{ userId: creatorId, isOwner: true }]
  });

  return event;
};


const getAllEvents = async () => {
  const events = await Event.find();
  return events;
}


const getEventById = async (eventId: string) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};


const updateEvent = async (eventId: string, eventData: Partial<EventInput>) => {


}

export { createEvent, getAllEvents, getEventById, updateEvent };
