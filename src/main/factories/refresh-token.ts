import { DbCheckRefreshToken } from "../../data/usecase/check-refresh-token/check-refresh-token";
import { LogControllerDecorator } from "../../decorators/log";
import { GetRefreshTokenMongoRepository } from "../../infra/db/mongodb/refresh-token-repository/get-refresh-token";
import { RefreshTokenController } from "../../presentation/controller/refresh-token/refresh-token";
import type { Controller } from "../../presentation/protocols/controller";
import { UtilCreateAcessToken } from "../../utils/";

export const makeRefreshTokenController = (): Controller => {
  const getRefreshTokenRepository = new GetRefreshTokenMongoRepository();
  const checkRefreshToken = new DbCheckRefreshToken(getRefreshTokenRepository);

  const createAcessToken = new UtilCreateAcessToken();

  const refreshTokenController = new RefreshTokenController(
    checkRefreshToken,
    createAcessToken
  );

  return new LogControllerDecorator(refreshTokenController);
};
