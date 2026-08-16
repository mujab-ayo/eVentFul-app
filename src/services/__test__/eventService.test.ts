
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import User from "../../models/User.js";
import Event from "../../models/Event.js";
import { registerUser } from "../authService.js";
import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../eventService.js";

const runId = Date.now();

describe("eventService", () => {
  let ownerId: string;
  let strangerId: string;
  let createdEventId: string;

  beforeAll(async () => {
    const owner = await registerUser(
      "Event Owner",
      `test-event-owner-${runId}@example.com`,
      "password123",
    );
    ownerId = owner._id.toString();

    const stranger = await registerUser(
      "Random Stranger",
      `test-event-stranger-${runId}@example.com`,
      "password123",
    );
    strangerId = stranger._id.toString();
  });

  afterAll(async () => {
    await Event.deleteMany({ title: { $regex: /^Test Event / } });
    await User.deleteMany({ email: { $regex: /^test-event-/ } });
  });

  it("creates an event and automatically adds the creator as an owner-collaborator", async () => {
    const event = await createEvent(
      {
        title: `Test Event ${runId}`,
        description: "A test event",
        category: "test",
        venue: "Test Venue",
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        expectedAttendees: 10,
        ticketPrice: 1000,
      },
      ownerId,
    );

    createdEventId = event._id.toString();

    expect(event.createdBy.toString()).toBe(ownerId);
    expect(event.collaborators).toHaveLength(1);
    expect(event.collaborators[0]?.userId?.toString()).toBe(ownerId);
    expect(event.collaborators[0]?.isOwner).toBe(true);
  });

  it("retrieves the event by id", async () => {
    const event = await getEventById(createdEventId);
    expect(event._id.toString()).toBe(createdEventId);
  });

  it("throws 'Event not found' for a nonexistent (but validly formatted) id", async () => {
    await expect(getEventById("000000000000000000000000")).rejects.toThrow(
      "Event not found",
    );
  });

  it("allows the owner to update their own event", async () => {
    const updated = await updateEvent(createdEventId, ownerId, {
      title: `Test Event Updated ${runId}`,
    });

    expect(updated.title).toBe(`Test Event Updated ${runId}`);
  });

  it("blocks a non-collaborator stranger from updating the event", async () => {
    await expect(
      updateEvent(createdEventId, strangerId, { title: "Hacked title" }),
    ).rejects.toThrow("Not authorized");
  });

  it("blocks a non-collaborator stranger from deleting the event", async () => {
    await expect(deleteEvent(createdEventId, strangerId)).rejects.toThrow(
      "Not authorized",
    );
  });

  it("allows the owner to delete their own event", async () => {
    const result = await deleteEvent(createdEventId, ownerId);
    expect(result).toBeDefined();

   
    await expect(getEventById(createdEventId)).rejects.toThrow(
      "Event not found",
    );
  });
});
