import type { Express } from "express";
import { Router } from "express";
import fg from "fast-glob";
import { logger } from "../../utils/logger";

export const setupRoutes = (app: Express) => {
  const router = Router();

  app.use("/api", router);

  fg.sync([
    "**/src/main/routes/**-router/**-router.ts",
    "**/src/main/routes/**/**-router/**-router.ts",
  ]).map(async (file) => {
    const fileList = file.split("/");
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const index = fileList.length - 1;
    logger.info(`Loading the file router ${fileList[index]} ...`);
    (
      await import(
        `../../../${
          process.env.JEST_WORKER_ID ? file : file.replace("ts", "js")
        }`
      )
    ).default(router);
  });
};
