import express, { Request, Response } from "express";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";

const app = express();

app.use(express.json());
app.use(logger);

//* Initialize DB
initDB();

//* Root Route
app.get("/", async (req: Request, res: Response) => {
  res.send("Vehicle Rental System Server Is Running...");
});

//* ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);

//* NOT FOUND ROUTE
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found!",
    path: req.path,
  });
});

export default app;
