import type { Request, Response } from "express";

import { createOrder } from "../services/orderService.js";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;

    if (!id) {
      return res.status(401).json("Unauthorized");
    }

    const eventId = req.params.id;

    if (typeof eventId !== "string") {
      return res.status(404).json("Event does not exist");
    }

    const { ticketQuantity } = req.body;

    const ticket = await createOrder(eventId, id, ticketQuantity);

    return res.status(201).json(ticket);
  } catch (error) {
    if (error instanceof Error && error.message === "Event does not exist") {
      return res.status(404).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Not enough tickets available"
    ) {
      return res.status(409).json({ error: error.message });
    }

    if (error instanceof Error && error.message === "Invalid ticket number") {
      return res.status(400).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};
