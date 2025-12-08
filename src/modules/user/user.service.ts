import { pool } from "../../config/db";

const getUsers = async () => {
  const result = await pool.query(`SELECT id,name,email,phone,role FROM users`);
  return result.rows;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

export const userServices = {
  getUsers,
  updateUser: () => {},
  deleteUser,
};
