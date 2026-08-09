import { Router } from "express";
import {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController
} from "../controllers/eventController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllEventsController);

router.post("/", authMiddleware, createEventController);

router.get("/:id", getEventByIdController);

router.put("/:id", authMiddleware, updateEventController);

router.delete("/:id", authMiddleware, deleteEventController);

export default router;
