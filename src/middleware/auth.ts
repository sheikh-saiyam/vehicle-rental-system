import { NextFunction } from "express";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {};
};

export default auth;
