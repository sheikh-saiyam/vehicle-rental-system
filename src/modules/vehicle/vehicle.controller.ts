import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);

    res.status(200).json({
      success: true,
      message: "Vehicle created successfully",
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

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehicles();

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
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

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await vehicleServices.getVehicleById(id!);

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
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

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await vehicleServices.updateVehicle(id!, req.body);

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
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

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await vehicleServices.deleteVehicle(id!);

    if (result.rowCount === 0) {
      res.status(200).json({
        success: false,
        message: "Vehicle not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
      errors: (error as Error).stack,
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
