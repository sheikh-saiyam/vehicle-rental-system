import { pool } from "../../config/db";

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

const getBookings = async (role: "admin" | "customer", customer_id: string) => {
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

export const bookingsServices = {
  createBooking,
  getBookings,
  updateBooking: () => {},
};
