import type { Encrypter } from "../../../data/protocols/encrypter";
import type { AccountModel } from "../../../domain/models/account";
import type { GetAccountByEmail } from "../../../domain/usecase/get-account-by-email";
import type { ResetRefreshToken } from "../../../domain/usecase/reset-refresh-token";
import { InvalidParamError, UserNotExistsError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import type { Validation } from "../../helpers/validators/validation";
import { SignInController } from "./sign-in";

const makeFakeHttpRequest = () => ({
  body: {
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "valid_password",
  },
});

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
  const resetRefreshTokenStub = makeResetRefreshTokenStub();
  const encrypterStub = makeEncrypterStub();
  const validationStub = makeValidationStub();

  const sut = new SignInController(
    getAccountByEmailStub,
    resetRefreshTokenStub,
    encrypterStub,
    validationStub
  );

  return {
    sut,
    getAccountByEmailStub,
    resetRefreshTokenStub,
    encrypterStub,
  };
};

describe("SignIn Controller", () => {
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
