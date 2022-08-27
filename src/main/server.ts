import { mongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
import { logger } from "../utils/logger";
import env from "./config/env";

const bootstrap = async () => {
  let mongoConectionCheck = true;

  await mongoHelper
    .connect(env.mongoUrl)
    .then(() => logger.info("mongoDB started"))
    .catch((err) => {
      logger.error(err);
      mongoConectionCheck = false;
    });

  if (!mongoConectionCheck) return logger.fatal("Error in Mongodb connection");

  const app = (await import("./config/app")).default;
  app.listen(env.port, () =>
    logger.info(`Server started with http://localhost:${env.port}`)
  );
};

bootstrap().then(() => {
  logger.info("API made by (Willian Cavalcanti Coelho)");
});
