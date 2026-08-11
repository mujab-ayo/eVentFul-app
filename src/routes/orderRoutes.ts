import { Router } from "express";
import { getMyOrderController } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, getMyOrderController);

export default router;
