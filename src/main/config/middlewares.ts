import type { Express } from "express";
import { bodyParser } from "../middlewares/body-parse";
import { contentType } from "../middlewares/content-type";
import { cors } from "../middlewares/cors";
import { passContentHeaderMiddleware } from "../middlewares/pass-content-header";
import rateLimit from "express-rate-limit";

export const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser);
  app.use(contentType);
  app.use(cors);
  app.use(passContentHeaderMiddleware);
  app.use(rateLimit);
};
