import { Request, Response } from "express";
import { authServices } from "./auth.service";

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.registerUser(req.body);

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
      errors: (error as Error).stack,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authServices.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
      errors: (error as Error).stack,
    });
  }
};

export const authControllers = {
  registerUser,
  loginUser,
};
