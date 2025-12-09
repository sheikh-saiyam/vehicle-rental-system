import { Request, Response } from "express";
import { bookingsServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

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
      message: "Bookings retrieved successfully",
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

export const bookingsControllers = {
  createBooking,
  getBookings,
  updateBooking: () => {},
};
