import type { NextFunction, Request, Response } from "express";

export const contentType = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.setHeader("Content-Type", "application/json");
  next();
};
