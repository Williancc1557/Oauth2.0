import { TokenInfoController } from "../../presentation/controller/token-info/token-info";
import { UtilGetTokenInfo } from "../../utils/get-token-info/get-token-info";
import { UtilVerifyAccessToken } from "../../utils/verify-access-token/verify-access-token";
import { makeTokenInfoValidation } from "./token-info-validation";

export const makeTokenInfoController = () => {
  const getTokenInfo = new UtilGetTokenInfo();

  const verifyTokenAccess = new UtilVerifyAccessToken();

  const controller = new TokenInfoController(
    getTokenInfo,
    verifyTokenAccess,
    makeTokenInfoValidation()
  );

  return controller;
};
