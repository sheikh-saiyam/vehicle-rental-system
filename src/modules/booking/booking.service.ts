import { pool } from "../../config/db";
import { RoleType } from "../../types/auth.types";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const rentStartDate = new Date(rent_start_date as string);
  const rentEndDate = new Date(rent_end_date as string);

  if (new Date(rentStartDate) > new Date(rentEndDate)) {
    throw new Error("rent_start_date must be before rent_end_date");
  }

  const numberOfDates = rentEndDate.getDate() - rentStartDate.getDate();

  const vehicleResult = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status === "booked") {
    throw new Error("Vehicle is not available for booking. Already booked!");
  }

  const totalPrice = numberOfDates * vehicle.daily_rent_price;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      totalPrice,
      "active",
    ]
  );

  if (result.rows[0].id) {
    await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, [
      "booked",
      vehicle_id,
    ]);
  }

  return {
    ...result.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const updateStatus = async () => {
  const bookings = await pool.query(
    `SELECT id, status, rent_end_date, vehicle_id FROM bookings`
  );

  bookings.rows.map(async (booking: any) => {
    const today = new Date().getDate();
    const rent_end_date = new Date(booking.rent_end_date).getDate();

    if (today >= rent_end_date) {
      Promise.all([
        await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2`, [
          "returned",
          booking.id,
        ]),
        await pool.query(
          `UPDATE vehicles SET availability_status=$1 WHERE id=$2`,
          ["available", booking.vehicle_id]
        ),
      ]);
    }
  });
};

const getBookings = async (role: RoleType, customer_id: string) => {
  await updateStatus();

  const [bookingsResult, usersResult, vehiclesResult] = await Promise.all([
    role === "customer"
      ? pool.query(`SELECT * FROM bookings WHERE customer_id = $1`, [
          customer_id,
        ])
      : pool.query(`SELECT * FROM bookings`),
    role === "customer"
      ? pool.query(`SELECT id, name, email FROM users WHERE id = $1`, [
          customer_id,
        ])
      : pool.query(`SELECT id, name, email FROM users`),
    pool.query(
      `SELECT id, vehicle_name, type, registration_number FROM vehicles`
    ),
  ]);

  const result = bookingsResult.rows.map((item) => {
    const { name, email } = usersResult.rows.find(
      (i) => Number(i.id) === Number(item.customer_id)
    );
    const { vehicle_name, registration_number, type } =
      vehiclesResult.rows.find((i) => Number(i.id) === Number(item.vehicle_id));

    return {
      ...item,
      ...(role === "admin" && { customer: { name, email } }),
      vehicle: {
        vehicle_name,
        registration_number,
        ...(role === "customer" && { type }),
      },
    };
  });

  return result;
};

const updateBooking = async (
  id: string,
  role: RoleType,
  status: "returned" | "cancelled"
) => {
  //? Status Validation
  if (status !== "cancelled" && status !== "returned") {
    return { message: "Invalid status! must be cancelled or returned" };
  }
  if (role === "customer" && status === "returned") {
    return { message: "Customer can't return the booking" };
  }
  if (role === "admin" && status === "cancelled") {
    return { message: "Bad Request: Admin can only mark as returned" };
  }

  const booking = await pool.query(
    `SELECT rent_start_date FROM bookings WHERE id=$1`,
    [id]
  );

  if (booking.rowCount === 0) {
    throw new Error("Booking not found!");
  }

  const today = new Date().getDate();
  const rent_start_date = new Date(booking.rows[0].rent_start_date).getDate();

  if (today >= rent_start_date) {
    return {
      message: "Can't cancel booking. rental period has already started",
    };
  }

  const bookingResult = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, id]
  );

  if (bookingResult.rowCount === 0) {
    throw new Error("Booking not found!");
  }

  const bookingData = bookingResult.rows[0];

  let vehicle = null;
  if (bookingResult.rowCount! > 0) {
    const vehicleResult = await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`,
      ["available", bookingData.vehicle_id]
    );
    vehicle = vehicleResult.rows[0];
  }

  return {
    message:
      status === "returned"
        ? "Booking marked as returned. Vehicle is now available"
        : "Booking cancelled successfully",
    data: {
      ...bookingData,
      ...(status === "returned" && {
        vehicle: {
          availability_status: vehicle.availability_status,
        },
      }),
    },
  };
};

export const bookingsServices = {
  createBooking,
  getBookings,
  updateBooking,
};
