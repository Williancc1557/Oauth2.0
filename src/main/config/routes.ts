import type { Express } from "express";
import { Router } from "express";
import fg from "fast-glob";

export const setupRoutes = (app: Express) => {
  const router = Router();

  app.use("/api", router);

  fg.sync([
    "**/src/main/routes/**-router/**.router.ts",
    "**/src/main/routes/**/**-router/**.router.ts",
  ]).map(async (file) => {
    (await import(`../../../${file}`)).default(router);
  });
};
