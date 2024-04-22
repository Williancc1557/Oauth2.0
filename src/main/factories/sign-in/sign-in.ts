import { DbGetAccountByEmail } from "../../../data/usecase/get-account-by-email";
import { DbResetRefreshToken } from "../../../data/usecase/reset-refresh-token";
import { LogControllerDecorator } from "../../../decorators/log";
import { GetAccountByEmailMongoRepository } from "../../../infra/db/mongodb/account-repository/get-account-by-email-repository/get-account-by-email-repository";
import { ResetRefreshTokenMongoRepository } from "../../../infra/db/mongodb/reset-refresh-token-repository/reset-refresh-token-repository";
import { SignInController } from "../../../presentation/controller/sign-in";

import { UtilCreateRefreshToken, UtilEncrypter } from "../../../utils/";
import { makeSignInValidation } from "./sign-in-validation";

export const makeSignInController = () => {
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
    getAccountByEmail,
    resetRefreshToken,
    encrypter,
    makeSignInValidation()
  );

  return new LogControllerDecorator(signInController);
};
