import { DbGetAccountByEmail } from "../../data/usecase/get-account-by-email/get-account-by-email";
import { DbResetRefreshToken } from "../../data/usecase/reset-refresh-token/reset-refresh-token";
import { GetAccountByEmailMongoRepository } from "../../infra/db/mongodb/account-repository/get-account-by-email-repository/get-account-by-email-repository";
import { ResetRefreshTokenMongoRepository } from "../../infra/db/mongodb/reset-refresh-token-repository/reset-refresh-token-repository";
import { SignInController } from "../../presentation/controller/sign-in/sign-in";

import {
  UtilCreateRefreshToken,
  UtilEncrypter,
  UtilPasswordValidator,
  UtilRequiredParams,
  UtilValidateEmail,
} from "../../utils/";

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

  const SALTS = 10;
  const encrypter = new UtilEncrypter(SALTS);

  const signInController = new SignInController(
    validateEmail,
    passwordValidator,
    requiredParams,
    getAccountByEmail,
    resetRefreshToken,
    encrypter
  );

  return signInController;
};
