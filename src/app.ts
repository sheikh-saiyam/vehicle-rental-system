import express, { Request, Response } from "express";
import logger from "./middleware/logger";

const app = express();

app.use(express.json());
app.use(logger);

app.get("/", async (req: Request, res: Response) => {
  res.send("Vehicle Rental System Server Is Running...");
});

//* ROUTES

//* NOT FOUND ROUTE
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found!",
    path: req.path,
  });
});

export default app;
