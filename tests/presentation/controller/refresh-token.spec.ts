import { RefreshTokenController } from "../../../src/presentation/controller/refresh-token";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../../src/presentation/helpers/http-helper";
import { InvalidParamError } from "../../../src/presentation/errors";

const makeFakeHttpRequest = () => ({
  header: {
    refreshtoken: "valid_access_token",
  },
});

const makeSut = () => {
  const createAccessTokenStub = {
    create: jest.fn(() => ({
      accessToken: "valid_access_token",
      expiresIn: 300,
    })),
  };
  const checkRefreshTokenStub = {
    check: jest.fn(async () => "valid_user_id"),
  };
  const validationStub = {
    validate: jest.fn(),
  };

  const sut = new RefreshTokenController(
    checkRefreshTokenStub,
    createAccessTokenStub,
    validationStub
  );

  return {
    sut,
    checkRefreshTokenStub,
    createAccessTokenStub,
    validationStub,
  };
};

describe("RefreshToken Controller", () => {
  test("should return 500 if checkRefreshToken has any error", async () => {
    const { sut, checkRefreshTokenStub } = makeSut();
    checkRefreshTokenStub.check.mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(serverError());
  });

  test("should return 500 if createAccessTokenStub has any error", async () => {
    const { sut, createAccessTokenStub } = makeSut();

    createAccessTokenStub.create.mockImplementation(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(serverError());
  });

  test("should return 400 if checkRefreshToken returns null", async () => {
    const { sut, checkRefreshTokenStub } = makeSut();
    checkRefreshTokenStub.check.mockReturnValueOnce(null);
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(unauthorized());
  });

  test("should checkRefreshToken is called with correct accessToken", async () => {
    const { sut, checkRefreshTokenStub } = makeSut();
    const checkRefreshTokenSpy = checkRefreshTokenStub.check;
    await sut.handle(makeFakeHttpRequest());

    expect(checkRefreshTokenSpy).toHaveBeenCalledWith("valid_access_token");
  });

  test("should create access is called with correct id", async () => {
    const { sut, createAccessTokenStub } = makeSut();
    const createAccessTokenSpy = createAccessTokenStub.create;
    await sut.handle(makeFakeHttpRequest());

    expect(createAccessTokenSpy).toHaveBeenCalledWith("valid_user_id");
  });

  test("should return 200 if success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(
      ok({
        accessToken: "valid_access_token",
        expiresIn: 300,
      })
    );
  });

  test("should return 400 if validation returns an error", async () => {
    const { sut, validationStub } = makeSut();

    validationStub.validate.mockReturnValueOnce(
      new InvalidParamError("refreshtoken")
    );

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(
      badRequest(new InvalidParamError("refreshtoken"))
    );
  });
});
