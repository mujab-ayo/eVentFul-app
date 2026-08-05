import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bearerToken = authHeader.split(" ")[1];

    if (!bearerToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    const payload = jwt.verify(bearerToken, process.env.JWT_SECRET);

    if (typeof payload === "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ message: error.message });
    }

    return res.status(401).json({ message: "Unauthorized" });
  }
};
