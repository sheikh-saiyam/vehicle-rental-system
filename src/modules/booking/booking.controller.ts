import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { bookingsServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingsServices.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
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

const getBookings = async (req: Request, res: Response) => {
  try {
    const { role, id: customer_id } = req.user as JwtPayload;
    const result = await bookingsServices.getBookings(role!, customer_id!);

    res.status(201).json({
      success: true,
      message:
        role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
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

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.user as JwtPayload;
    const { status } = req.body || {};

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: Status is required",
      });
    }

    const response = await bookingsServices.updateBooking(id!, role, status);

    if (response.data === undefined) {
      res.status(404).json({
        success: false,
        message: response.message,
      });
    }

    res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
      errors: (error as Error).stack,
    });
  }
};

export const bookingsControllers = {
  createBooking,
  getBookings,
  updateBooking,
};
