import type { NextFunction, Request, Response } from "express";

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Methods", "*");
  next();
};
