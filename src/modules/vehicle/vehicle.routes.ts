import express from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../types/auth.types";
import { vehicleControllers } from "./vehicle.controller";

const router = express.Router();

//? ADMIN ONLY

router.post("/", auth(Roles.admin), vehicleControllers.createVehicle);

router.get("/", vehicleControllers.getVehicles);

router.get("/:id", vehicleControllers.getVehicleById);

router.put("/:id", auth(Roles.admin), vehicleControllers.updateVehicle);

router.delete("/:id", auth(Roles.admin), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
