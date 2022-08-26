import type { Encrypter } from "../../../data/protocols/encrypter";
import type { AccountModel } from "../../../domain/models/account";
import type { GetAccountByEmail } from "../../../domain/usecase/get-account-by-email";
import type { ResetRefreshToken } from "../../../domain/usecase/reset-refresh-token";
import {
  InvalidParamError,
  MissingParamError,
  UserNotExistsError,
} from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import type { PasswordValidator } from "../../protocols/password-validator";
import type { RequiredParams } from "../../protocols/required-params";
import type { ValidateEmail } from "../../protocols/validate-email";
import { SignInController } from "./sign-in";

const makeFakeHttpRequest = () => ({
  body: {
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "valid_password",
  },
});

const makeValidateEmailStub = () => {
  class ValidateEmailStub implements ValidateEmail {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(email: string): boolean {
      return true;
    }
  }

  return new ValidateEmailStub();
};

const makePasswordValidatorStub = () => {
  class PasswordValidatorStub implements PasswordValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(password: string): boolean {
      return true;
    }
  }

  return new PasswordValidatorStub();
};

const makeRequiredParams = () => {
  class RequiredParamsStub implements RequiredParams {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public check(requiredParams: Array<string>, body: any): string {
      return;
    }
  }

  return new RequiredParamsStub();
};

const makeGetAccountByEmailStub = () => {
  class GetAccountByEmailStub implements GetAccountByEmail {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async get(email: string): Promise<AccountModel | null> {
      return {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "hashed_password",
        refreshToken: "valid_refreshToken",
      };
    }
  }

  return new GetAccountByEmailStub();
};

const makeResetRefreshTokenStub = () => {
  class ResetRefreshTokenStub implements ResetRefreshToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async reset(userId: string): Promise<string> {
      return "new_refresh_token";
    }
  }

  return new ResetRefreshTokenStub();
};

const makeEncrypterStub = () => {
  class EncrypterStub implements Encrypter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async compare(value: string, hashedValue: string): Promise<boolean> {
      return true;
    }

    public hash: (value: string) => Promise<string>;
  }

  return new EncrypterStub();
};

const makeSut = () => {
  const validateEmailStub = makeValidateEmailStub();
  const passwordValidatorStub = makePasswordValidatorStub();
  const requiredParamsStub = makeRequiredParams();
  const getAccountByEmailStub = makeGetAccountByEmailStub();
  const resetRefreshTokenStub = makeResetRefreshTokenStub();
  const encrypterStub = makeEncrypterStub();

  const sut = new SignInController(
    validateEmailStub,
    passwordValidatorStub,
    requiredParamsStub,
    getAccountByEmailStub,
    resetRefreshTokenStub,
    encrypterStub
  );

  return {
    sut,
    validateEmailStub,
    passwordValidatorStub,
    requiredParamsStub,
    getAccountByEmailStub,
    resetRefreshTokenStub,
    encrypterStub,
  };
};

describe("SignIn Controller", () => {
  test("should return statusCode 400 if email is not provided", async () => {
    const { sut, requiredParamsStub } = makeSut();
    jest.spyOn(requiredParamsStub, "check").mockReturnValueOnce("email");

    const httpRequest = {
      body: {
        email: "any_email@gmail.com",
      },
    };

    const res = await sut.handle(httpRequest);

    expect(res).toStrictEqual(badRequest(new MissingParamError("email")));
  });

  test("should validateEmail is called with correct values", async () => {
    const { sut, validateEmailStub } = makeSut();
    const validateSpy = jest.spyOn(validateEmailStub, "validate");
    await sut.handle(makeFakeHttpRequest());

    expect(validateSpy).toBeCalledWith("valid_email@mail.com");
  });

  test("should returns statusCode 400 if validateEmail returns false", async () => {
    const { sut, validateEmailStub } = makeSut();
    jest.spyOn(validateEmailStub, "validate").mockReturnValueOnce(false);
    const req = await sut.handle(makeFakeHttpRequest());

    expect(req).toStrictEqual(badRequest(new InvalidParamError("email")));
  });

  test("should returns statusCode 500 if validateEmail throws", async () => {
    const { sut, validateEmailStub } = makeSut();

    jest.spyOn(validateEmailStub, "validate").mockImplementation(() => {
      throw new Error();
    });

    const req = await sut.handle(makeFakeHttpRequest());

    expect(req).toStrictEqual(serverError());
  });

  test("should passwordValidator is called with correct values", async () => {
    const { sut, passwordValidatorStub } = makeSut();
    const validateSpy = jest.spyOn(passwordValidatorStub, "validate");
    await sut.handle(makeFakeHttpRequest());

    expect(validateSpy).toBeCalledWith("valid_password");
  });

  test("should SignIn returns statusCode 400 if passwordValidator return false", async () => {
    const { sut, passwordValidatorStub } = makeSut();
    jest.spyOn(passwordValidatorStub, "validate").mockReturnValueOnce(false);
    const res = await sut.handle(makeFakeHttpRequest());

    expect(res).toStrictEqual(badRequest(new InvalidParamError("password")));
  });

  test("should SignIn returns statusCode 400 if account don't exists", async () => {
    const { sut, getAccountByEmailStub } = makeSut();
    jest.spyOn(getAccountByEmailStub, "get").mockReturnValueOnce(undefined);
    const res = await sut.handle(makeFakeHttpRequest());

    expect(res).toStrictEqual(badRequest(new UserNotExistsError()));
  });

  test("should resetRefreshToken is called with correct values", async () => {
    const { sut, resetRefreshTokenStub } = makeSut();
    const resetSpy = jest.spyOn(resetRefreshTokenStub, "reset");
    await sut.handle(makeFakeHttpRequest());

    expect(resetSpy).toBeCalledWith("valid_id");
  });

  test("should encrypter.compare is called with correct values", async () => {
    const { sut, encrypterStub } = makeSut();
    const compareSpy = jest.spyOn(encrypterStub, "compare");
    await sut.handle(makeFakeHttpRequest());

    expect(compareSpy).toBeCalledWith("valid_password", "hashed_password");
  });

  test("should return statusCode 400 if encrypter.compare return false", async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "compare").mockResolvedValueOnce(false);
    const res = await sut.handle(makeFakeHttpRequest());

    expect(res).toStrictEqual(badRequest(new InvalidParamError("password")));
  });

  test("should resetRefreshToken not return undefined", async () => {
    const { sut, resetRefreshTokenStub } = makeSut();
    const resetSpy = jest.spyOn(resetRefreshTokenStub, "reset");
    await sut.handle(makeFakeHttpRequest());

    expect(resetSpy).toBeTruthy();
  });
});
