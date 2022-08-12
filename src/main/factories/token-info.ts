import { DbIsValidRefreshToken } from "../../data/usecase/is-valid-refresh-token/is-valid-refresh-token";
import { GetAccountByIdMongoRepository } from "../../infra/db/mongodb/account-repository/get-account-by-id-repository/get-account-by-id-repository";
import { TokenInfoController } from "../../presentation/controller/token-info/token-info";
import { UtilRequiredParams } from "../../utils";
import { UtilGetTokenInfo } from "../../utils/get-token-info/get-token-info";
import { UtilVerifyAccessToken } from "../../utils/verify-access-token/verify-access-token";

export const makeTokenInfoController = () => {
  const requiredParams = new UtilRequiredParams();
  const getTokenInfo = new UtilGetTokenInfo();

  const getAccountByIdRepository = new GetAccountByIdMongoRepository();
  const isValidRefreshToken = new DbIsValidRefreshToken(
    getAccountByIdRepository
  );

  const verifyTokenAccess = new UtilVerifyAccessToken();

  const controller = new TokenInfoController(
    requiredParams,
    getTokenInfo,
    isValidRefreshToken,
    verifyTokenAccess
  );

  return controller;
};
