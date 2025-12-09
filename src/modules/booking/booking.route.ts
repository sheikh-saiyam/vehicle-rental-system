import express from "express";
import { bookingsControllers } from "./booking.controller";
import auth, { verifyUser } from "../../middleware/auth";
import { Roles } from "../../types/auth.types";

const router = express.Router();

router.post("/", auth(), bookingsControllers.createBooking);
router.get(
  "/",
  auth(Roles.admin, Roles.customer),
  bookingsControllers.getBookings
);
router.put(
  "/:id",
  auth(Roles.admin, Roles.customer),
  bookingsControllers.updateBooking
);

export const bookingsRoutes = router;
