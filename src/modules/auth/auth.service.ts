import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const registerUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  if ((password as string).length <= 5) {
    throw new Error("Password must be at least 6 characters long");
  }

  const formattedEmail = (email as string).toLowerCase();
  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `
    INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id,name,email,phone,role
    `,
    [name, formattedEmail, hashedPassword, phone, role ? role : "customer"]
  );

  return result.rows[0];
};

const loginUser = async (reqEmail: string, reqPassword: string) => {
  const result = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [reqEmail]
  );

  if (result.rows.length === 0) {
    return undefined;
  }

  const { id, name, email, password, phone, role } = result.rows[0];

  const isMatched = await bcrypt.compare(reqPassword, password);

  if (!isMatched) {
    throw new Error("Invalid password. Please try again!");
  }

  const token = jwt.sign({ name, email, role }, config.jwt_secret as string, {
    expiresIn: "7d",
  });

  console.log(`Token for ${name}:`, { token });

  return { token: token, user: { id, name, email, phone, role } };
};

export const authServices = {
  registerUser,
  loginUser,
};
