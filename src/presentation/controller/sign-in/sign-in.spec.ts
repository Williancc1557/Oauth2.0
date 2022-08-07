import type { AccountModel } from "../../../domain/models/account";
import type { GetAccountByEmail } from "../../../domain/usecase/get-account-by-email";
import type { ResetRefreshToken } from "../../../domain/usecase/reset-refresh-token";
import type { PasswordValidator } from "../../protocols/password-validator";
import type { RequiredParams } from "../../protocols/required-params";
import type { ValidateEmail } from "../../protocols/validate-email";
import { SignInController } from "./sign-in";

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
        password: "valid_password",
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

const makeSut = () => {
  const validateEmailStub = makeValidateEmailStub();
  const passwordValidatorStub = makePasswordValidatorStub();
  const requiredParamsStub = makeRequiredParams();
  const getAccountByEmailStub = makeGetAccountByEmailStub();
  const resetRefreshToken = makeResetRefreshTokenStub();

  const sut = new SignInController(
    validateEmailStub,
    passwordValidatorStub,
    requiredParamsStub,
    getAccountByEmailStub,
    resetRefreshToken
  );

  return {
    sut,
    validateEmailStub,
    passwordValidatorStub,
    requiredParamsStub,
    getAccountByEmailStub,
    resetRefreshToken,
  };
};

describe("SignIn Controller", () => {
  test("should return statusCode 400 if password is not provided", async () => {
    const { sut, requiredParamsStub } = makeSut();

    jest.spyOn(requiredParamsStub, "check").mockReturnValueOnce("email");

    const httpRequest = {
      body: {},
    };

    const res = await sut.handle(httpRequest);

    expect(res.statusCode).toBe(400);
  });

  test("should validateEmail is called with correct values", async () => {
    const { sut, validateEmailStub } = makeSut();

    const validateEmailSpy = jest.spyOn(validateEmailStub, "validate");

    const httpRequest = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    await sut.handle({ body: httpRequest });

    expect(validateEmailSpy).toBeCalledWith("valid_email@mail.com");
  });

  test("should returns statusCode 400 if validateEmail returns false", async () => {
    const { sut, validateEmailStub } = makeSut();

    jest.spyOn(validateEmailStub, "validate").mockReturnValueOnce(false);

    const httpRequest = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.statusCode).toBe(400);
  });

  test("should returns statusCode 500 if validateEmail throws", async () => {
    const { sut, validateEmailStub } = makeSut();

    jest.spyOn(validateEmailStub, "validate").mockImplementation(() => {
      throw new Error();
    });

    const httpRequest = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.statusCode).toBe(500);
  });

  test("should passwordValidator is called with correct values", async () => {
    const { sut, passwordValidatorStub } = makeSut();

    const nameValidatorSpy = jest.spyOn(passwordValidatorStub, "validate");

    const httpRequest = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    await sut.handle({ body: httpRequest });

    expect(nameValidatorSpy).toBeCalledWith("valid_password");
  });

  test("should SignIn returns statusCode 400 if passwordValidator return false", async () => {
    const { sut, passwordValidatorStub } = makeSut();

    jest.spyOn(passwordValidatorStub, "validate").mockReturnValueOnce(false);

    const httpRequest = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.statusCode).toBe(400);
  });

  test("should SignIn returns statusCode 400 if account don't exists", async () => {
    const { sut, getAccountByEmailStub } = makeSut();

    jest.spyOn(getAccountByEmailStub, "get").mockReturnValueOnce(undefined);

    const httpRequest = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.statusCode).toBe(400);
  });

  test("should resetRefreshToken is called with correct values", async () => {
    const { sut, resetRefreshToken } = makeSut();

    const nameValidatorSpy = jest.spyOn(resetRefreshToken, "reset");

    const httpRequest = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    await sut.handle({ body: httpRequest });

    expect(nameValidatorSpy).toBeCalledWith("valid_id");
  });

  test("should resetRefreshToken not return undefined", async () => {
    const { sut, resetRefreshToken } = makeSut();

    const nameValidatorSpy = jest.spyOn(resetRefreshToken, "reset");

    const httpRequest = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    await sut.handle({ body: httpRequest });

    expect(nameValidatorSpy).toBeTruthy();
  });
});
