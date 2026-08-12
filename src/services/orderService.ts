import { getEventById } from "./eventService.js";
import Ticket from "../models/Ticket.js";
import Order from "../models/Order.js";

export const createOrder = async (
  eventId: string,
  buyerId: string,
  ticketQuantity: number,
): Promise<InstanceType<typeof Order>> => {
  const seatSold = await Ticket.countDocuments({ eventId });

  const event = await getEventById(eventId);

  const maxCapacity = event.expectedAttendees;

  if (ticketQuantity < 1) {
    throw new Error("Invalid ticket number");
  }

  if (seatSold + ticketQuantity > maxCapacity) {
    throw new Error("Not enough tickets available");
  }

  const totalAmount = ticketQuantity * event.ticketPrice;

  const order = await Order.create({
    eventId,
    buyerId,
    totalAmount,
    ticketQuantity,
  });

  return order;
};

export const getMyOrder = async (buyerId: string) => {
  return await Order.find({ buyerId });
};

export const getOrdersForEvent = async (eventId: string, id: string) => {
  const event = await getEventById(eventId);

  const collabStatus = event.collaborators.some(
    (collab) => id === collab.userId?.toString(),
  );

  if (!collabStatus) {
    throw new Error("Not authorized to view orders for this event");
  }

  const orders = await Order.find({ eventId });

  return orders;
};

export const initializePayment = async (orderId: string, userEmail: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "pending") {
    throw new Error("Order is not payable");
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("Payment service is not configured");
  }

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        amount: order.totalAmount * 100,
      }),
    },
  );

  const data = await response.json();

  if (!data) {
    throw new Error("Failed to initialize payment");
  }

  return {
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
  };
};
