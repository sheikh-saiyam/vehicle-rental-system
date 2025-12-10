import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  if (
    !vehicle_name ||
    !type ||
    !registration_number ||
    !daily_rent_price ||
    !availability_status
  ) {
    throw new Error(
      "all fields are required. please provide: vehicle_name, type, registration_number, daily_rent_price, availability_status fields to create vehicle"
    );
  }

  if (daily_rent_price) {
    if (typeof daily_rent_price !== "number") {
      throw new Error("daily_rent_price must be a number");
    }
    if (daily_rent_price < 0) {
      throw new Error("daily_rent_price must be a positive number");
    }
  }

  if (availability_status) {
    if (
      (availability_status as string) !== "available" &&
      (availability_status as string) !== "booked"
    ) {
      throw new Error("availability_status value must be available or booked");
    }
  }

  const result = await pool.query(
    `
    INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status ? availability_status : "available",
    ]
  );

  return result.rows[0];
};

const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const getVehicleById = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result;
};

const updateVehicle = async (id: string, payload: Record<string, unknown>) => {
  const vehicleResult = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [id]
  );

  if (vehicleResult.rowCount === 0) {
    return vehicleResult;
  }

  const vehicle = vehicleResult.rows[0];

  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload || {};

  if (daily_rent_price) {
    if (typeof daily_rent_price === "number") {
      if ((daily_rent_price as number) < 0) {
        throw new Error("daily_rent_price must be a positive number");
      }
      Number(daily_rent_price);
    } else {
      throw new Error("daily_rent_price must be a number");
    }
  }

  if (availability_status) {
    if (
      (availability_status as string) !== "available" &&
      (availability_status as string) !== "booked"
    ) {
      throw new Error("availability_status value must be available or booked");
    }
  }

  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name=$2, type=$3, registration_number=$4, daily_rent_price=$5, availability_status=$6 WHERE id=$1 RETURNING *`,
    [
      id,
      vehicle_name ? vehicle_name : vehicle.vehicle_name,
      type ? type : vehicle.type,
      registration_number ? registration_number : vehicle.registration_number,
      daily_rent_price ? daily_rent_price : vehicle.daily_rent_price,
      availability_status ? availability_status : vehicle.availability_status,
    ]
  );

  return result;
};

const deleteVehicle = async (id: string) => {
  const bookingResult = await pool.query(
    `SELECT vehicle_id, rent_end_date, status FROM bookings WHERE vehicle_id=$1`,
    [id]
  );

  const isActive = bookingResult.rows.some((i) => i.status === "active");
  if (isActive) {
    throw new Error("can't delete vehicle with active bookings");
  }

  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
  return result;
};

export const vehicleServices = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
