import type { NextFunction, Request, Response } from "express";

export const passContentHeaderMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.headers.url = req.url;
  req.headers.method = req.method;

  next();
};
