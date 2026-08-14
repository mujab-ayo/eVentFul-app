import { Router } from "express";
import {
  getMyOrderController,
  initializePaymentController,
  verifyPaymentController,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, getMyOrderController);

router.post("/:id/pay", authMiddleware, initializePaymentController);

router.get("/verify/:reference", verifyPaymentController);

export default router;
