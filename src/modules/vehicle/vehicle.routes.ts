import express from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../types/auth";
import { vehicleControllers } from "./vehicle.controller";

const router = express.Router();

//? ADMIN ONLY

router.post("/", auth(Roles.admin), vehicleControllers.createVehicle);

router.get("/", auth(Roles.admin), vehicleControllers.getVehicles);

router.get("/:id", auth(Roles.admin), vehicleControllers.getVehicleById);

router.put("/:id", auth(Roles.admin), vehicleControllers.updateVehicle);

router.delete("/:id", auth(Roles.admin), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
