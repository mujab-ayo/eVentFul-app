import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import Event from "../../models/Event.js";

const runId = Date.now();

async function registerAndLogin(label: string) {
  const email = `test-integration-events-${label}-${runId}@example.com`;
  const password = "password123";

  await request(app)
    .post("/auth/register")
    .send({
      name: `Test ${label}`,
      email,
      password,
    });

  const loginRes = await request(app)
    .post("/auth/login")
    .send({ email, password });

  return {
    token: loginRes.body.token as string,
    userId: loginRes.body.user._id as string,
  };
}

describe("Event CRUD (integration)", () => {
  let ownerToken: string;
  let strangerToken: string;
  let eventId: string;

  beforeAll(async () => {
    const owner = await registerAndLogin("owner");
    ownerToken = owner.token;

    const stranger = await registerAndLogin("stranger");
    strangerToken = stranger.token;
  });

  afterAll(async () => {
    await Event.deleteMany({ title: { $regex: /^Integration Test Event/ } });
    await User.deleteMany({ email: { $regex: /^test-integration-events-/ } });
  });

  it("rejects event creation with no auth token (401)", async () => {
    const res = await request(app).post("/events").send({
      title: "Should Not Exist",
      description: "x",
      category: "test",
      venue: "x",
      startDate: new Date(),
      endDate: new Date(),
      expectedAttendees: 10,
      ticketPrice: 100,
    });

    expect(res.status).toBe(401);
  });

  it("creates an event when authenticated (201)", async () => {
    const res = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        title: `Integration Test Event ${runId}`,
        description: "Created via integration test",
        category: "test",
        venue: "Test Venue",
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        expectedAttendees: 10,
        ticketPrice: 1000,
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(`Integration Test Event ${runId}`);
    eventId = res.body._id;
  });

  it("lists all events publicly, with no auth required (200)", async () => {
    const res = await request(app).get("/events");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("gets a single event publicly (200)", async () => {
    const res = await request(app).get(`/events/${eventId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(eventId);
  });

  it("returns 404 for a well-formed but nonexistent event id", async () => {
    const res = await request(app).get("/events/000000000000000000000000");
    expect(res.status).toBe(404);
  });

  it("returns 400 for a malformed event id", async () => {
    const res = await request(app).get("/events/not-a-real-id");
    expect(res.status).toBe(400);
  });

  it("allows the owner to update their event (200)", async () => {
    const res = await request(app)
      .put(`/events/${eventId}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ title: `Integration Test Event Updated ${runId}` });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(`Integration Test Event Updated ${runId}`);
  });

  it("blocks a non-collaborator stranger from updating the event (403)", async () => {
    const res = await request(app)
      .put(`/events/${eventId}`)
      .set("Authorization", `Bearer ${strangerToken}`)
      .send({ title: "Hacked" });

    expect(res.status).toBe(403);
  });

  it("blocks a non-collaborator stranger from deleting the event (403)", async () => {
    const res = await request(app)
      .delete(`/events/${eventId}`)
      .set("Authorization", `Bearer ${strangerToken}`);

    expect(res.status).toBe(403);
  });

  it("allows the owner to delete their event (200)", async () => {
    const res = await request(app)
      .delete(`/events/${eventId}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
  });

  it("confirms the event is really gone (404 on subsequent fetch)", async () => {
    const res = await request(app).get(`/events/${eventId}`);
    expect(res.status).toBe(404);
  });
});
