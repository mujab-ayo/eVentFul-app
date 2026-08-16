import { getEventById } from "./eventService.js";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";

export const getEventAnalytics = async (
  eventId: string,
  requesterId: string,
) => {
  const event = await getEventById(eventId);

  const collabStatus = event.collaborators.some(
    (collab) => requesterId === collab.userId?.toString(),
  );

  if (!collabStatus) {
    throw new Error("Not authorized to view orders for this event");
  }

  const scannedTicketsSold = await Ticket.countDocuments({
    eventId,
    isScanned: true,
  });

  const totalTicketsSold = await Ticket.countDocuments({ eventId });

  const attendanceRate =
    totalTicketsSold === 0 ? 0 : (scannedTicketsSold / totalTicketsSold) * 100;

  return {
    totalTicketsSold,
    totalScanned: scannedTicketsSold,
    attendanceRate: attendanceRate.toFixed(2) + "%",
  };
};

export const getMyEventsAnalytics = async (userId: string) => {
  const myEvents = await Event.find({ "collaborators.userId": userId });

 const myEventIds = myEvents.map((event) => event._id);

 const result = await Ticket.aggregate([
    { $match: { eventId: { $in: myEventIds } } },
    {
      $group: {
        _id: null,
        totalTickets: { $sum: 1 },
        totalScanned: { $sum: { $cond: ["$isScanned", 1, 0] } },
      },
    },
  ]);

  const stats = result[0] || { totalTickets: 0, totalScanned: 0 };

  return {
    totalEvents: myEvents.length,
    totalTicketsSold: stats.totalTickets,
    totalScanned: stats.totalScanned,
  };
};
