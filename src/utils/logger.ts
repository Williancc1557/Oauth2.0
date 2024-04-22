import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  levelFirst: true,
  colorize: true,
});

export const logger = pino(
  {
    enabled: !(process.env.JEST_WORKER_ID !== undefined),
    level: "debug",
  },
  stream
);
