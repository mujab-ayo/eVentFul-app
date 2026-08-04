import type { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService.js";

const registerUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    res.status(201).json( user );
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "something went wrong" });
    }
  }
};

const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const {token, user} = await loginUser(email, password);

    res.status(200).json({ token, user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "something went wrong" });
    }
  }
};

export { registerUserController, loginUserController };
