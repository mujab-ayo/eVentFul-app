import Ticket from "../models/Ticket.js";
import QRCode from "qrcode";

import { getEventById } from "./eventService.js";

export const getTicketQRCode = async (
  ticketId: string,
  requesterId: string,
) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  if (requesterId !== ticket.attendeeUserId.toString()) {
    throw new Error("Not authorized to view this ticket");
  }

  const qrCodeImage = await QRCode.toDataURL(ticket.qrCodeToken);

  return { ticket, qrCodeImage };
};

export const scanTicket = async (qrCodeToken: string, scannerId: string) => {
  const ticket = await Ticket.findOne({ qrCodeToken });

  if (!ticket) {
    throw new Error("Invalid Ticket");
  }

  if (ticket.isScanned) {
    throw new Error("Ticket has already been used");
  }

  const event = await getEventById(ticket.eventId.toString());

  const collaborator = event.collaborators.find(
    (collab) => collab.userId?.toString() === scannerId,
  );

  if (!collaborator) {
    throw new Error("Not authorized to scan tickets for this event");
  }

  ticket.isScanned = true;
  ticket.scannedAt = new Date();

  await ticket.save();

  return ticket;
};

export const getSharableEvent = async (eventId: string) => {
  const event = await getEventById(eventId);

  const baseUrl = process.env.BASE_URL;

  if (!process.env.BASE_URL) {
    throw new Error("BASE_URL is not configured");
  }

  const eventUrl = `${baseUrl}/${eventId}`;

  const shareText = `Check out ${event.title} on Eventful`;

  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}  ${eventUrl}`)}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText}  ${eventUrl}`)}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${shareText}  ${eventUrl}`)}`;

  return {
    eventUrl,
    shareText,
    links: {
      whatsAppUrl,
      twitterUrl,
      facebookUrl,
      linkedInUrl,
    },
  };
};
