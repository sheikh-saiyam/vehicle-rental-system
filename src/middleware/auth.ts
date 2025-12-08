import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: ("admin" | "customer")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;
      console.log("Bearer Token:", { bearerToken });
      const token = bearerToken?.split("Bearer ")[1];
      console.log("Token:", { token });

      if (!token) {
        return res.status(500).json({
          success: false,
          message: "Unauthorized to perform this action!",
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwt_secret as string
      ) as JwtPayload;

      req.user = decoded;
      console.log({ role: decoded.role });

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(500).json({
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

export default auth;
