import {Router} from "express";
import { createEventController, getAllEventsController, getEventByIdController } from "../controllers/eventController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllEventsController);

router.post("/", authMiddleware, createEventController);

router.get("/:id", getEventByIdController);

export default router;
