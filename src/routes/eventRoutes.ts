import { Router } from "express";
import {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
  addCollaboratorController,
  toggleCollaboratorController,
  removeCollaboratorController,
} from "../controllers/eventController.js";

import { createOrderController } from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllEventsController);

router.post("/", authMiddleware, createEventController);

router.get("/:id", getEventByIdController);

router.put("/:id", authMiddleware, updateEventController);

router.delete("/:id", authMiddleware, deleteEventController);

router.post("/:id/collaborators", authMiddleware, addCollaboratorController);

router.patch(
  "/:id/collaborators/:userId",
  authMiddleware,
  toggleCollaboratorController,
);

router.delete(
  "/:id/collaborators/:userId",
  authMiddleware,
  removeCollaboratorController,
);

router.post("/:id/orders", authMiddleware, createOrderController);

export default router;
