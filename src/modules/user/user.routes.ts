import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { Roles } from "../../types/auth";

const router = express.Router();

//? ADMIN ONLY
router.get("/", auth(Roles.admin), userControllers.getUsers);

//? ADMIN & CUSTOMER
router.put("/:id", userControllers.updateUser);

//? ADMIN ONLY
router.delete("/:id", auth(Roles.admin), userControllers.deleteUser);

export const userRoutes = router;
