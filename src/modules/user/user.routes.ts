import express from "express";
import auth, { verifyUser } from "../../middleware/auth";
import { Roles } from "../../types/auth";
import { userControllers } from "./user.controller";

const router = express.Router();

//? ADMIN ONLY
router.get("/", auth(Roles.admin), userControllers.getUsers);

//? ADMIN & CUSTOMER
router.put(
  "/:id",
  auth(Roles.admin, Roles.customer),
  verifyUser(),
  userControllers.updateUser
);

//? ADMIN ONLY
router.delete("/:id", auth(Roles.admin), userControllers.deleteUser);

export const userRoutes = router;
