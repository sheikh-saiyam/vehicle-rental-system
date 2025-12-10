# 🚗 Vehicle Rental System

## 🔗 Live Deployment - Vercel

### [➡ Project Live Link](https://vehicle-rental-system-by-saiyam.vercel.app/)

## 🎯 Project Overview

A backend for a vehicle rental management system that handles:

- **Vehicles**: Manage vehicle inventory with availability tracking
- **Customers**: Manage customer accounts and profiles
- **Bookings**: Handle vehicle rentals, returns and cost calculation
- **Authentication**: Secure role-based access control (admin & customer roles)

## 🛠️ Technology Stack

- **Node.js** + **TypeScript**
- **Express.js** (web framework)
- **PostgreSQL** (database)
- **bcryptjs** (password hashing)
- **jsonwebtoken** (JWT authentication)

## 🚀 Features

### ✔ Authentication & Authorization

- JWT-based authentication
- Secure password hashing with bcrypt
- Role-based access control (Admin & Customer)

### ✔ User Management

- Register & log in users
- Admin can manage all users
- Customers can update their own profile

### ✔ Vehicle Management

- Add, update, delete vehicles (Admin only)
- View all vehicles or a single vehicle
- Track availability status

### ✔ Booking Management

- Create bookings with date validation
- Auto price calculation (daily rent × duration)
- Role-based booking visibility
- Admin can mark vehicles as returned
- Customers can cancel their own bookings before the start
- System: Auto-mark as "returned" when period ends and make vehicle available

## 📁 Project Structure

```
src/
 ├── config/
 ├── middlewares/
 ├── modules/
 │    ├── auth/
 │    ├── users/
 │    ├── vehicles/
 │    └── bookings/
 ├── types/
 └── app.ts
 └── server.ts
```

Each feature contains its own **routes**, **controllers**, **services**

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
 git clone https://github.com/sheikh-saiyam/vehicle-rental-system
 cd vehicle-rental-system
```

### 2️⃣ Install Dependencies

```bash
 pnpm or npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the project root:

```
PORT=5000
DATABASE_URL=postgres://your_user:your_pass@localhost:5432/your_db
JWT_SECRET=your_secret_key
```

### 4️⃣ Start the Server

```bash
 pnpm dev
```

## 👉 Usage

Once the server is running, access the API using:

```
http://localhost:5000/api/v1/
```

Some important endpoints:

- **POST** `/api/v1/auth/signup`
- **POST** `/api/v1/auth/signin`
- **GET** `/api/v1/vehicles`
- **POST** `/api/v1/bookings`

More details in the [API_REFERENCE.md](https://github.com/Apollo-Level2-Web-Dev/B6A2/blob/main/API_REFERENCE.md).

#### Made with ❤️ by **Sheikh Saiyam**
