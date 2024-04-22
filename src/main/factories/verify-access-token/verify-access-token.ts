import { VerifyAccessTokenController } from "../../../presentation/controller/verify-access-token";
import { UtilVerifyAccessToken } from "../../../utils/verify-access-token";
import { makeAccessTokenValidation } from "./verify-access-token-validation";

export const makeVerifyAccessTokenController = () => {
  const utilVerifyAccessToken = new UtilVerifyAccessToken();
  const verifyAccessTokenValidation = makeAccessTokenValidation();
  return new VerifyAccessTokenController(
    utilVerifyAccessToken,
    verifyAccessTokenValidation
  );
};
