import { DbGetAccountByEmail } from "../../data/usecase/get-account-by-email/get-account-by-email";
import { DbResetRefreshToken } from "../../data/usecase/reset-refresh-token/reset-refresh-token";
import { GetAccountByEmailMongoRepository } from "../../infra/db/mongodb/account-repository/get-account-by-email-repository/get-account-by-email-repository";
import { ResetRefreshTokenMongoRepository } from "../../infra/db/mongodb/reset-refresh-token-repository/reset-refresh-token-repository";
import { SignInController } from "../../presentation/controller/sign-in/sign-in";
import { UtilCreateRefreshToken } from "../../utils/create-refresh-token/create-refresh-token";
import { UtilPasswordValidator } from "../../utils/password-validator/password-validator";
import { UtilRequiredParams } from "../../utils/required-params/required-params";
import { UtilValidateEmail } from "../../utils/validate-email/validate-email";

export const makeSignInController = () => {
  const validateEmail = new UtilValidateEmail();
  const passwordValidator = new UtilPasswordValidator();
  const requiredParams = new UtilRequiredParams();

  const getAccountByEmailRepository = new GetAccountByEmailMongoRepository();
  const getAccountByEmail = new DbGetAccountByEmail(
    getAccountByEmailRepository
  );

  const createRefreshToken = new UtilCreateRefreshToken();
  const resetRefreshTokenRepository = new ResetRefreshTokenMongoRepository(
    createRefreshToken
  );
  const resetRefreshToken = new DbResetRefreshToken(
    resetRefreshTokenRepository
  );

  const signInController = new SignInController(
    validateEmail,
    passwordValidator,
    requiredParams,
    getAccountByEmail,
    resetRefreshToken
  );

  return signInController;
};
