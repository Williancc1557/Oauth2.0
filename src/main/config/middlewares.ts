import type { Express } from "express";
import { bodyParser } from "../middlewares/body-parse";
import { contentType } from "../middlewares/content-type";
import { cors } from "../middlewares/cors";

export const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser);
  app.use(contentType);
  app.use(cors);
};
