import {
  InvalidParamError,
  UserNotExistsError,
} from "../../../src/presentation/errors";
import { badRequest } from "../../../src/presentation/helpers/http-helper";
import { SignInController } from "../../../src/presentation/controller/sign-in";

const makeFakeHttpRequest = () => ({
  body: {
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "valid_password",
  },
});

const makeSut = () => {
  const getAccountByEmailStub = {
    get: jest.fn(async () => ({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password",
      refreshToken: "valid_refreshToken",
    })),
  };
  const resetRefreshTokenStub = {
    reset: jest.fn(async () => "new_refresh_token"),
  };
  const encrypterStub = {
    compare: jest.fn(async () => true),
    hash: jest.fn(),
  };
  const validationStub = {
    validate: jest.fn(),
  };

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
    validationStub,
  };
};

describe("SignIn Controller", () => {
  test("should SignIn returns statusCode 400 if account don't exists", async () => {
    const { sut, getAccountByEmailStub } = makeSut();
    getAccountByEmailStub.get.mockReturnValueOnce(undefined);
    const res = await sut.handle(makeFakeHttpRequest());

    expect(res).toStrictEqual(badRequest(new UserNotExistsError()));
  });

  test("should resetRefreshToken is called with correct values", async () => {
    const { sut, resetRefreshTokenStub } = makeSut();
    await sut.handle(makeFakeHttpRequest());

    expect(resetRefreshTokenStub.reset).toHaveBeenCalledWith("valid_id");
  });

  test("should encrypter.compare is called with correct values", async () => {
    const { sut, encrypterStub } = makeSut();
    await sut.handle(makeFakeHttpRequest());

    expect(encrypterStub.compare).toHaveBeenCalledWith(
      "valid_password",
      "hashed_password"
    );
  });

  test("should return statusCode 400 if encrypter.compare return false", async () => {
    const { sut, encrypterStub } = makeSut();
    encrypterStub.compare.mockResolvedValueOnce(false);
    const res = await sut.handle(makeFakeHttpRequest());

    expect(res).toStrictEqual(badRequest(new InvalidParamError("password")));
  });

  test("should resetRefreshToken not return undefined", async () => {
    const { sut, resetRefreshTokenStub } = makeSut();
    await sut.handle(makeFakeHttpRequest());

    expect(resetRefreshTokenStub.reset).toBeTruthy();
  });

  test("should return 400 if validation returns an error", async () => {
    const { sut, validationStub } = makeSut();

    validationStub.validate.mockReturnValueOnce(new InvalidParamError("email"));

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(
      badRequest(new InvalidParamError("email"))
    );
  });
});
