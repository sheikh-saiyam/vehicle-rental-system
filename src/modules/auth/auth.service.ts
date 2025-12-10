import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const registerUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  if (!name || !email || !password || !phone || !role) {
    throw new Error(
      "all fields are required. please provide: name, email, password, phone, role fields to signup"
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email as string)) {
    throw new Error(
      "invalid email format. please provide a valid email address"
    );
  }

  if ((password as string).length <= 5) {
    throw new Error("password must be at least 6 characters long");
  }

  if (role) {
    if (role !== "admin" && role !== "customer") {
      throw new Error("user role must be admin or customer");
    }
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

  const token = jwt.sign(
    { id, name, email, role },
    config.jwt_secret as string,
    {
      expiresIn: "7d",
    }
  );

  return { token: token, user: { id, name, email, phone, role } };
};

export const authServices = { registerUser, loginUser };
