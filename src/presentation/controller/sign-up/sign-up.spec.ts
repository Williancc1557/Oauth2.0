import type { CreateAccessTokenOutput } from "../../../data/protocols";
import type { AccountModel } from "../../../domain/models/account";
import type {
  AddAccount,
  AddAccountInput,
} from "../../../domain/usecase/add-account";
import type { GetAccountByEmail } from "../../../domain/usecase/get-account-by-email";
import { UtilRequiredParams } from "../../../utils/required-params/required-params";
import {
  AccountAlreadyExistsError,
  InvalidParamError,
  MissingParamError,
} from "../../errors";
import {
  badRequest,
  conflict,
  ok,
  serverError,
} from "../../helpers/http-helper";
import type { NameValidator } from "../../protocols/name-validator";
import type { PasswordValidator } from "../../protocols/password-validator";
import type { ValidateEmail } from "../../protocols/validate-email";
import { SignUpController } from "./sign-up";

const makeFakeHttpRequest = () => ({
  body: {
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "valid_password",
  },
});

const makePasswordValidatorStub = (): PasswordValidator => {
  class PasswordValidatorStub implements PasswordValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(name: string): boolean {
      return true;
    }
  }

  return new PasswordValidatorStub();
};

const makeNameValidatorStub = (): NameValidator => {
  class NameValidatorStub implements NameValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(name: string): boolean {
      return true;
    }
  }

  return new NameValidatorStub();
};

const makeValidateEmailStub = () => {
  class ValidateEmailStub implements ValidateEmail {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(email: string): boolean {
      return true;
    }
  }

  return new ValidateEmailStub();
};

const makeGetAccountByEmailStub = () => {
  class GetAccountByEmailStub implements GetAccountByEmail {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async get(email: string): Promise<AccountModel | null> {
      return null;
    }
  }

  return new GetAccountByEmailStub();
};

const makeAddAccountStub = () => {
  class AddAccountStub implements AddAccount {
    public async add(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      account: AddAccountInput
    ): Promise<AccountModel & CreateAccessTokenOutput> {
      return {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        refreshToken: "valid_refreshToken",
        accessToken: "valid_accessToken",
        expiresIn: 300,
      };
    }
  }

  return new AddAccountStub();
};

const makeSut = () => {
  const validateEmailStub = makeValidateEmailStub();
  const getAccountByEmailStub = makeGetAccountByEmailStub();
  const addAccountStub = makeAddAccountStub();
  const nameValidatorStub = makeNameValidatorStub();
  const passwordValidatorStub = makePasswordValidatorStub();
  const requiredParams = new UtilRequiredParams();

  const sut = new SignUpController(
    validateEmailStub,
    getAccountByEmailStub,
    addAccountStub,
    nameValidatorStub,
    passwordValidatorStub,
    requiredParams
  );

  return {
    sut,
    validateEmailStub,
    getAccountByEmailStub,
    addAccountStub,
    nameValidatorStub,
    passwordValidatorStub,
  };
};

describe("Sign-Up", () => {
  test("should returns statusCode 400 if name is not provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const httpResponse = await sut.handle({ body: httpRequest });

    expect(httpResponse).toStrictEqual(
      badRequest(new MissingParamError("name"))
    );
  });

  test("should returns statusCode 400 if email is not provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      name: "valid_name",
      password: "valid_password",
    };

    const httpResponse = await sut.handle({ body: httpRequest });

    expect(httpResponse).toStrictEqual(
      badRequest(new MissingParamError("email"))
    );
  });

  test("should returns statusCode 400 if password is not provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      name: "valid_name",
      email: "valid_email@mail.com",
    };

    const httpResponse = await sut.handle({ body: httpRequest });

    expect(httpResponse).toStrictEqual(
      badRequest(new MissingParamError("password"))
    );
  });

  test("should validateEmail is called with correct values", async () => {
    const { sut, validateEmailStub } = makeSut();

    const validateEmailSpy = jest.spyOn(validateEmailStub, "validate");

    await sut.handle(makeFakeHttpRequest());

    expect(validateEmailSpy).toBeCalledWith("valid_email@mail.com");
  });

  test("should returns statusCode 400 if validateEmail returns false", async () => {
    const { sut, validateEmailStub } = makeSut();
    jest.spyOn(validateEmailStub, "validate").mockReturnValueOnce(false);
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(
      badRequest(new InvalidParamError("email"))
    );
  });

  test("should returns statusCode 500 if validateEmail throws", async () => {
    const { sut, validateEmailStub } = makeSut();

    jest.spyOn(validateEmailStub, "validate").mockImplementation(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(serverError());
  });

  test("should nameValidator is called with correct values", async () => {
    const { sut, nameValidatorStub } = makeSut();

    const nameValidatorSpy = jest.spyOn(nameValidatorStub, "validate");
    await sut.handle(makeFakeHttpRequest());

    expect(nameValidatorSpy).toBeCalledWith("valid_name");
  });

  test("should SignUp returns statusCode 400 if nameValidator return false", async () => {
    const { sut, nameValidatorStub } = makeSut();

    jest.spyOn(nameValidatorStub, "validate").mockReturnValueOnce(false);
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(
      badRequest(new InvalidParamError("name"))
    );
  });

  test("should passwordValidator is called with correct values", async () => {
    const { sut, passwordValidatorStub } = makeSut();

    const nameValidatorSpy = jest.spyOn(passwordValidatorStub, "validate");
    await sut.handle(makeFakeHttpRequest());

    expect(nameValidatorSpy).toBeCalledWith("valid_password");
  });

  test("should SignUp returns statusCode 400 if passwordValidator return false", async () => {
    const { sut, passwordValidatorStub } = makeSut();

    jest.spyOn(passwordValidatorStub, "validate").mockReturnValueOnce(false);
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(
      badRequest(new InvalidParamError("password"))
    );
  });

  test("should getAccountByEmail is called with correct values", async () => {
    const { sut, getAccountByEmailStub } = makeSut();

    const getAccountByEmailSpy = jest.spyOn(getAccountByEmailStub, "get");
    await sut.handle(makeFakeHttpRequest());

    expect(getAccountByEmailSpy).toBeCalledWith("valid_email@mail.com");
  });

  test("should returns statusCode 409 if account already exists", async () => {
    const { sut, getAccountByEmailStub } = makeSut();

    jest.spyOn(getAccountByEmailStub, "get").mockResolvedValue({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
      refreshToken: "valid_refresh_token",
    });
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(
      conflict(new AccountAlreadyExistsError())
    );
  });

  test("should returns statusCode 500 if getAccountByEmail throws", async () => {
    const { sut, getAccountByEmailStub } = makeSut();

    jest.spyOn(getAccountByEmailStub, "get").mockRejectedValueOnce(Error);
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(serverError());
  });

  test("should AddAccount is called with correct values", async () => {
    const { sut, addAccountStub } = makeSut();

    const addAccountSpy = jest.spyOn(addAccountStub, "add");
    await sut.handle(makeFakeHttpRequest());

    expect(addAccountSpy).toBeCalledWith({
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    });
  });

  test("should returns statusCode 500 if addAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, "add").mockRejectedValueOnce(Error);
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(serverError());
  });

  test("should returns statusCode 200 if success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(
      ok({
        refreshToken: "valid_refreshToken",
        accessToken: "valid_accessToken",
        expiresIn: 300,
      })
    );
  });

  test("should returns account in the body if success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse.body).toStrictEqual({
      refreshToken: "valid_refreshToken",
      accessToken: "valid_accessToken",
      expiresIn: 300,
    });
  });
});
