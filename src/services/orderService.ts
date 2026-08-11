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
