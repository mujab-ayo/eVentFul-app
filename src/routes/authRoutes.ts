import { Router } from "express";
import {
  registerUserController,
  loginUserController,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/me", authMiddleware, (req, res) => {
  res.json({ message: "You are authenticated!", user: req.user });
});

export default router;
