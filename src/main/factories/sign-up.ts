import { DbAddAccount } from "../../data/usecase/add-account/add-account";
import { DbGetAccountByEmail } from "../../data/usecase/get-account-by-email/get-account-by-email";
import { AddAccountMongoRepository } from "../../infra/db/mongodb/account-repository/add-account-repository/add-account-repository";
import { GetAccountByEmailMongoRepository } from "../../infra/db/mongodb/account-repository/get-account-by-email-repository/get-account-by-email-repository";
import { SignUpController } from "../../presentation/controller/sign-up/sign-up";
import { UtilCreateAcessToken } from "../../utils/create-acess-token/create-acess-token";
import { UtilCreateRefreshToken } from "../../utils/create-refresh-token/create-refresh-token";
import { UtilNameValidator } from "../../utils/name-validator/name-validator";
import { UtilPasswordValidator } from "../../utils/password-validator/password-validator";
import { UtilValidateEmail } from "../../utils/validate-email/validate-email";

export const makeSignUpController = () => {
  const validateEmail = new UtilValidateEmail();

  const getAccountByEmailRepository = new GetAccountByEmailMongoRepository();
  const getAccountByEmail = new DbGetAccountByEmail(
    getAccountByEmailRepository
  );

  const createRefreshToken = new UtilCreateRefreshToken();
  const addAccountRepository = new AddAccountMongoRepository(
    createRefreshToken
  );
  const addAccount = new DbAddAccount(addAccountRepository);

  const createAcessToken = new UtilCreateAcessToken();
  const nameValidator = new UtilNameValidator();
  const passwordValidator = new UtilPasswordValidator();

  const signUpController = new SignUpController(
    validateEmail,
    getAccountByEmail,
    addAccount,
    createAcessToken,
    nameValidator,
    passwordValidator
  );

  return signUpController;
};
