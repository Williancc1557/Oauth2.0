import pino from "pino";

export const logger = pino({
  enabled: !(process.env.JEST_WORKER_ID !== undefined),
  level: "debug",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
