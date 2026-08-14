import { Router } from "express";

import {
  getTicketQRCodeController,
  scanTicketController,
} from "../controllers/ticketController.js";

const router = Router()



import authMiddleware from "../middleware/authMiddleware.js";

router.get("/:id/qrcode", authMiddleware, getTicketQRCodeController);

router.post("/scan", authMiddleware, scanTicketController);

export default router