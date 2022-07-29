import { DbAddAccount } from "../../data/usecase/add-account/add-account";
import { DbGetAccountByEmail } from "../../data/usecase/get-account-by-email/get-account-by-email";
import { AddAccountMongoRepository } from "../../infra/db/mongodb/account-repository/add-account-repository";
import { GetAccountByEmailMongoRepository } from "../../infra/db/mongodb/account-repository/get-account-by-email-repository";
import { SignUpController } from "../../presentation/controller/sign-up/sign-up";
import { UtilCreateAcessToken } from "../../utils/create-acess-token";
import { UtilCreateRefreshToken } from "../../utils/create-refresh-token";
import { UtilValidateEmail } from "../../utils/validate-email";

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
  const signUpController = new SignUpController(
    validateEmail,
    getAccountByEmail,
    addAccount,
    createAcessToken
  );

  return signUpController;
};
