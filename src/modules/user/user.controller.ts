import { Request, Response } from "express";
import { userServices } from "./user.service";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsers();

    if (result.rowCount === 0) {
      res.status(200).json({
        success: true,
        message: "No users found",
        data: result.rows,
      });
    }

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
      errors: (error as Error).stack,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await userServices.updateUser(id!, req.body);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
      errors: (error as Error).stack,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userServices.deleteUser(id!);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
      errors: (error as Error).stack,
    });
  }
};

export const userControllers = { getUsers, updateUser, deleteUser };
