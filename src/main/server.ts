import { mongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
import { logger } from "../utils/logger";
import env from "./config/env";

const bootstrap = async () => {
  await mongoHelper
    .connect(env.mongoUrl)
    .then(() => logger.info("mongoDB started"))
    .catch((err) => logger.error(err));

  const app = (await import("./config/app")).default;
  app.listen(env.port, () =>
    logger.info(`Server started with http://localhost:${env.port}`)
  );
};

bootstrap().then(() => {
  logger.info("api learning english made by willian");
});
