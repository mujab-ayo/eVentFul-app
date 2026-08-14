import type { Request, Response } from "express";
import { getTicketQRCode, scanTicket } from "../services/ticketService.js";

export const getTicketQRCodeController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = req.user?.id;

    if (!id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const ticketId = req.params.id;

    if (typeof ticketId !== "string") {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const result = await getTicketQRCode(ticketId, id);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Ticket not found") {
      return res.status(404).json({ error: error.message });
    }

    if (
      error instanceof Error &&
      error.message === "Not authorized to view this ticket"
    ) {
      return res.status(403).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};




export const scanTicketController = async (
    req: Request,
    res: Response,
) => {
    try {
        const id = req.user?.id;

        if (!id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { qrCodeToken } = req.body
        
         if (typeof qrCodeToken !== "string") {
           return res.status(404).json({ error: "qrCodeToken is required" });
         }

        const result = await scanTicket(qrCodeToken, id);
        
        return res.status(200).json(result)
      
    } catch (error) {
        if (error instanceof Error && error.message === "Invalid Ticket") {
          return res.status(404).json({ error: error.message });
        }

        if (
          error instanceof Error &&
          error.message === "Ticket has already been used"
        ) {
          return res.status(409).json({ error: error.message });
        }

        if (
          error instanceof Error &&
          error.message === "Not authorized to scan tickets for this event"
        ) {
          return res.status(403).json({ error: error.message });
        }

        if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal Server Error" });
    }

}