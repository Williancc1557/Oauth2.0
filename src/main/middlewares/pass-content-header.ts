import type { NextFunction, Request, Response } from "express";
import requestIp from "request-ip";

export const passContentHeaderMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.headers.url = req.url;
  req.headers.method = req.method;
  req.headers.ip = requestIp.getClientIp(req);

  next();
};
