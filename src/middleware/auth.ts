import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { RoleType } from "../types/auth.types";

const auth = (...roles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;
      // console.log("Bearer Token:", { bearerToken });
      const token = bearerToken?.split("Bearer ")[1];
      // console.log("Token:", { token });

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized to perform this action!",
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload;

      req.user = decoded;
      // console.log({ role: decoded.role });

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: User role not allowed for this action!",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
        errors: (error as Error).stack,
      });
    }
  };
};

export const verifyUser = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken?.split("Bearer ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized to perform this action!",
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload;

      req.user = decoded;

      if (decoded.role === "customer") {
        // console.log({ matched: Number(decoded.id) !== Number(req.params.id) });
        // console.log({
        //   decodedId: Number(decoded.id),
        //   paramId: Number(req.params.id),
        // });
        if (Number(decoded.id) !== Number(req.params.id)) {
          res.status(403).json({
            success: false,
            message: "Forbidden: You can only access your own data",
          });
        }
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
        errors: (error as Error).stack,
      });
    }
  };
};

export default auth;
