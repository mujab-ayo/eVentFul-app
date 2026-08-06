import {Router} from "express";
import { createEventController, getAllEventsController } from "../controllers/eventController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllEventsController);

router.post("/", authMiddleware, createEventController);

export default router;
