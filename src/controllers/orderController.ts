import type { Request, Response } from "express";

import {
  createOrder,
  getMyOrder,
  getOrdersForEvent,
  initializePayment,
  verifyPayment,
} from "../services/orderService.js";

import User from "../models/User.js";

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

export const getMyOrderController = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;

    if (!id) {
      return res.status(401).json("Unauthorized");
    }

    const myOrder = await getMyOrder(id);

    return res.status(200).json(myOrder);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrdersForEventController = async (
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
    const orders = await getOrdersForEvent(eventId, id);

    return res.status(200).json(orders);
  } catch (error) {
    if (error instanceof Error && error.message === "Event does not exist") {
      return res.status(404).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Not authorized to view orders for this event"
    ) {
      return res.status(403).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const initializePaymentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = req.user?.id;

    if (!id) {
      return res.status(401).json("Unauthorized");
    }

    const orderId = req.params.id;

    if (typeof orderId !== "string") {
      return res.status(404).json("Order does not exist");
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const result = await initializePayment(orderId, user.email);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Order not found") {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof Error && error.message === "Order is not payable") {
      return res.status(409).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Payment service is not configured"
    ) {
      return res.status(500).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Failed to initialize payment"
    ) {
      return res.status(502).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyPaymentController = async (req: Request, res: Response) => {
  try {
    const reference = req.params.reference;

    if (typeof reference !== "string") {
      return res.status(404).json({ error: "Reference is required" });
    }

    const result = await verifyPayment(reference);

    return res.status(200).json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Order not found for this reference"
    ) {
      return res.status(404).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Payment was not successful"
    ) {
      return res.status(402).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Tickets are no longer available"
    ) {
      return res.status(409).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Payment service is not configured"
    ) {
      return res.status(500).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Failed to verify payment"
    ) {
      return res.status(502).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};
