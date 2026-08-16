# Eventful — Backend API

Eventful is a ticketing platform backend. It handles event creation and management (with collaborator/co-creator support), ticket purchasing via Paystack, QR code generation and gate verification, scheduled reminders, and analytics for event creators.

## 📄 API Documentation

Full API documentation (all endpoints, request/response examples) is published here:

**[View API Docs on Postman →](https://documenter.getpostman.com/view/50830698/2sBYApzYjR)**

## 🚀 Live API

Base URL: `https://eventful-app-re6o.onrender.com`

## 🛠️ Tech Stack

- **Runtime**: Node.js + TypeScript (ESM)
- **Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Cache / Job Queue**: Redis (via `ioredis` + BullMQ)
- **Authentication**: JWT + bcrypt
- **Payments**: Paystack
- **QR Codes**: `qrcode`
- **Rate Limiting**: `express-rate-limit`
- **Testing**: Vitest + Supertest

## ✨ Features

- **Authentication & Authorization** — JWT-based auth; resource-based (ownership) authorization rather than rigid roles. Any user can create events (becoming an owner) and buy tickets (becoming an attendee).
- **Event Management** — Full CRUD, plus a collaborator system: event owners can add co-creators, promote/demote them, and remove them, with built-in protection against removing the last remaining owner.
- **Ticketing & Payments** — Orders are created first (pending), then a Paystack transaction is initialized and verified. Tickets are only generated after payment is confirmed, with a real capacity check preventing overselling.
- **QR Codes** — Each ticket gets a unique, base64-encoded QR code. Event staff can scan a ticket to verify and mark attendance, with protection against reusing an already-scanned ticket.
- **Shareability** — Every event can generate ready-to-use share links for WhatsApp, X/Twitter, Facebook, and LinkedIn.
- **Reminders** — Users can schedule reminders for an event (e.g. "1 hour before"), processed via a Redis-backed background job queue (BullMQ), independent of the request/response cycle.
- **Analytics** — Per-event ticket sales and attendance-rate stats, plus combined analytics across all events a user manages (via MongoDB aggregation).
- **Caching** — Frequently-read event data is cached in Redis to reduce database load.
- **Rate Limiting** — Global request limits, with stricter limits on auth endpoints to reduce brute-force risk.

