import type { Express } from "express";
import { Router } from "express";
import fg from "fast-glob";
import { logger } from "../../utils/logger";
import env from "./env";

export const setupRoutes = (app: Express) => {
  const router = Router();

  app.use(router);

  const fileRule =
    env.state === "production"
      ? "**/main/routes/**/**-router/**-router.js"
      : "**/src/main/routes/**/**-router/**-router.ts";

  fg.sync([fileRule]).map(async (file) => {
    const fileList = file.split("/");
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const index = fileList.length - 1;
    logger.info(`Loading the file router ${fileList[index]} ...`);
    (await import(`../../../${file}`)).default(router);
  });
};
