import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: config.database_url,
});

const initDB = async () => {
  //? users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    emaiL VARCHAR(250) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone VARCHAR(15) NOT NULL, 
    role VARCHAR(10) NOT NULL 
    ) 
    `);

  //? vehicles talbe
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(200) NOT NULL,
    type VARCHAR(150) NOT NULL,
    registration_number VARCHAR(250) UNIQUE NOT NULL,
    daily_rent_price INT NOT NULL,
    availability_status VARCHAR(10) NOT NULL
    )
    `);

  //? bookings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings(    
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date TEXT NOT NULL,
    rent_end_date TEXT NOT NULL,
    total_price INT NOT NULL,
    status VARCHAR(15)
    )
    `);
};

export default initDB;
