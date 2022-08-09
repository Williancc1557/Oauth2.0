import { DbCheckRefreshToken } from "../../data/usecase/check-refresh-token/check-refresh-token";
import { LogControllerDecorator } from "../../decorators/log";
import { GetRefreshTokenMongoRepository } from "../../infra/db/mongodb/refresh-token-repository/get-refresh-token";
import { RefreshTokenController } from "../../presentation/controller/refresh-token/refresh-token";
import type { Controller } from "../../presentation/protocols/controller";
import { UtilCreateAccessToken } from "../../utils/";

export const makeRefreshTokenController = (): Controller => {
  const getRefreshTokenRepository = new GetRefreshTokenMongoRepository();
  const checkRefreshToken = new DbCheckRefreshToken(getRefreshTokenRepository);

  const createAccessToken = new UtilCreateAccessToken();

  const refreshTokenController = new RefreshTokenController(
    checkRefreshToken,
    createAccessToken
  );

  return new LogControllerDecorator(refreshTokenController);
};
