import { pool } from "../../config/db";

const getUsers = async () => {
  const result = await pool.query(`SELECT id,name,email,phone,role FROM users`);
  return result;
};

const deleteUser = async (id: string) => {
  const bookingResult = await pool.query(
    `SELECT customer_id, status FROM bookings WHERE customer_id=$1`,
    [id]
  );

  const isActive = bookingResult.rows.some((i) => i.status === "active");
  if (isActive) {
    throw new Error("can't delete user with active bookings");
  }

  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

const updateUser = async (id: string, payload: Record<string, unknown>) => {
  const userResult = await pool.query(
    `SELECT id,name,email,phone,role FROM users WHERE id = $1`,
    [id]
  );

  if (userResult.rowCount === 0) {
    return userResult;
  }

  const user = userResult.rows[0];

  const { name, email, phone, role } = payload || {};

  if (role) {
    if (role !== "admin" && role !== "customer") {
      throw new Error("user role must be admin or customer");
    }
  }

  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING id,name,email,phone,role`,
    [
      name ? name : user.name,
      email ? email : user.email,
      phone ? phone : user.phone,
      role ? role : user.role,
      id,
    ]
  );

  return result;
};

export const userServices = { getUsers, updateUser, deleteUser };
