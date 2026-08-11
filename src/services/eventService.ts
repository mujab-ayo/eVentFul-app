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
  const event = await getEventById(eventId);

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
  const event = await getEventById(eventId);

  const eventAccess =
    event.createdBy.toString() === id ||
    event.collaborators.some((collab) => collab.userId?.toString() === id);

  if (!eventAccess) {
    throw new Error("Not authorized to delete this event");
  }

  await Event.findByIdAndDelete(eventId);

  return { message: "Event deleted successfully" };
};

const addCollaborator = async (
  eventId: string,
  id: string,
  newCollaboratorId: string,
) => {
  const event = await getEventById(eventId);

  const collabStatus = event.collaborators.some(
    (collab) => id === collab.userId?.toString() && collab.isOwner === true,
  );

  if (!collabStatus) {
    throw new Error("Only owners can add collaborators");
  }

  const collabExist = event.collaborators.some(
    (collab) => collab.userId?.toString() === newCollaboratorId,
  );

  if (collabExist) {
    throw new Error("User is already a collaborator");
  }

  event.collaborators.push({
    userId: newCollaboratorId,
    isOwner: false,
  });

  await event.save();

  return event;
};

const toggleCollaboratorOwner = async (
  eventId: string,
  id: string,
  targetUserId: string,
) => {
  const event = await getEventById(eventId);

  const collabStatus = event.collaborators.some(
    (collab) => id === collab.userId?.toString() && collab.isOwner === true,
  );

  if (!collabStatus) {
    throw new Error("Only owners can toggle collaborators");
  }

  const targetCollaborator = event.collaborators.find(
    (collab) => collab.userId?.toString() === targetUserId,
  );

  if (!targetCollaborator) {
    throw new Error("This user is not a collaborator");
  }

  const ownerCount = event.collaborators.filter(
    (collab) => collab.isOwner === true,
  );

  if (targetCollaborator.isOwner === true && ownerCount.length === 1) {
    throw new Error("Cannot demote the last remaining owner");
  }

  targetCollaborator.isOwner = !targetCollaborator.isOwner;
  const updateEvent = await event.save();

  return updateEvent;
};



const removeCollaborator = async (eventId: string,
  id: string,
  targetUserId: string,
) => {
  const event = await getEventById(eventId);

  const collabStatus = event.collaborators.some(
    (collab) => id === collab.userId?.toString() && collab.isOwner === true,
  );

  if (!collabStatus) {
    throw new Error("Only owners can add collaborators");
  }

  const targetCollaborator = event.collaborators.find((collab) => collab.userId?.toString() === targetUserId)

  if (!targetCollaborator) {
    throw new Error("This user is not a collaborator");
  }

  const ownerCount = event.collaborators.filter(
    (collab) => collab.isOwner === true,
  );

  if (targetCollaborator.isOwner === true && ownerCount.length === 1) {
    throw new Error("Cannot delete the last remaining owner");
  }

  event.collaborators.pull({ userId: targetUserId });

  await event.save();

  return event;

}

export {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  addCollaborator,
  toggleCollaboratorOwner,
  removeCollaborator
};
