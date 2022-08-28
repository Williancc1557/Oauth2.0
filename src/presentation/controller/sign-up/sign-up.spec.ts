import type { CreateAccessTokenOutput } from "../../../data/protocols";
import type { AccountModel } from "../../../domain/models/account";
import type {
  AddAccount,
  AddAccountInput,
} from "../../../domain/usecase/add-account";
import type { GetAccountByEmail } from "../../../domain/usecase/get-account-by-email";
import { AccountAlreadyExistsError, InvalidParamError } from "../../errors";
import {
  badRequest,
  conflict,
  ok,
  serverError,
} from "../../helpers/http-helper";
import type { Validation } from "../../helpers/validators/validation";
import type { PasswordValidator } from "../../protocols/password-validator";
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

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = () => {
  const getAccountByEmailStub = makeGetAccountByEmailStub();
  const addAccountStub = makeAddAccountStub();
  const passwordValidatorStub = makePasswordValidatorStub();
  const validationStub = makeValidationStub();

  const sut = new SignUpController(
    getAccountByEmailStub,
    addAccountStub,
    passwordValidatorStub,
    validationStub
  );

  return {
    sut,
    getAccountByEmailStub,
    addAccountStub,
    passwordValidatorStub,
    validationStub,
  };
};

describe("Sign-Up", () => {
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

  test("should return 400 if validation returns an error", async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new InvalidParamError("email"));

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(
      badRequest(new InvalidParamError("email"))
    );
  });
});
