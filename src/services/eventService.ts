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

export { createEvent, getAllEvents };
