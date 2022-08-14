import { TokenInfoController } from "../../presentation/controller/token-info/token-info";
import { UtilRequiredParams } from "../../utils";
import { UtilGetTokenInfo } from "../../utils/get-token-info/get-token-info";
import { UtilVerifyAccessToken } from "../../utils/verify-access-token/verify-access-token";

export const makeTokenInfoController = () => {
  const requiredParams = new UtilRequiredParams();
  const getTokenInfo = new UtilGetTokenInfo();

  const verifyTokenAccess = new UtilVerifyAccessToken();

  const controller = new TokenInfoController(
    requiredParams,
    getTokenInfo,
    verifyTokenAccess
  );

  return controller;
};
