import { DbAddAccount } from "../../data/usecase/add-account/add-account";
import { DbGetAccountByEmail } from "../../data/usecase/get-account-by-email/get-account-by-email";
import { LogControllerDecorator } from "../../decorators/log";
import { AddAccountMongoRepository } from "../../infra/db/mongodb/account-repository/add-account-repository/add-account-repository";
import { GetAccountByEmailMongoRepository } from "../../infra/db/mongodb/account-repository/get-account-by-email-repository/get-account-by-email-repository";
import { SignUpController } from "../../presentation/controller/sign-up/sign-up";

import {
  UtilCreateAccessToken,
  UtilCreateRefreshToken,
  UtilEncrypter,
  UtilNameValidator,
  UtilPasswordValidator,
  UtilValidateEmail,
} from "../../utils/";
import { makeSignUpValidation } from "./sign-up-validation";

export const makeSignUpController = () => {
  const validateEmail = new UtilValidateEmail();

  const getAccountByEmailRepository = new GetAccountByEmailMongoRepository();
  const getAccountByEmail = new DbGetAccountByEmail(
    getAccountByEmailRepository
  );

  const createRefreshToken = new UtilCreateRefreshToken();
  const createAccessToken = new UtilCreateAccessToken();
  const addAccountRepository = new AddAccountMongoRepository(
    createRefreshToken,
    createAccessToken
  );

  const SALTS = 10;
  const encrypter = new UtilEncrypter(SALTS);
  const addAccount = new DbAddAccount(addAccountRepository, encrypter);

  const nameValidator = new UtilNameValidator();
  const passwordValidator = new UtilPasswordValidator();

  const signUpController = new SignUpController(
    validateEmail,
    getAccountByEmail,
    addAccount,
    nameValidator,
    passwordValidator,
    makeSignUpValidation()
  );

  return new LogControllerDecorator(signUpController);
};
