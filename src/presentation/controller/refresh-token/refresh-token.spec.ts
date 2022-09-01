import { RefreshTokenController } from "./refresh-token";
import type {
  CreateAccessToken,
  CreateAccessTokenOutput,
} from "../../../data/protocols/create-access-token";
import type { CheckRefreshToken } from "../../../domain/usecase/check-refresh-token";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import { InvalidParamError } from "../../errors";
import type { Validation } from "../../protocols/validation";

const makeFakeHttpRequest = () => ({
  header: {
    refreshtoken: "valid_access_token",
  },
});

const makeCheckRefreshTokenStub = (): CheckRefreshToken => {
  class CheckRefreshToken implements CheckRefreshToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async check(refreshToken: string): Promise<string | undefined> {
      return "valid_user_id";
    }
  }

  return new CheckRefreshToken();
};

const makeCreateAccessTokenStub = (): CreateAccessToken => {
  class CreateAccessToken implements CreateAccessToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public create(userId: string): CreateAccessTokenOutput {
      return {
        accessToken: "valid_access_token",
        expiresIn: 300,
      };
    }
  }

  return new CreateAccessToken();
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
  const checkRefreshTokenStub = makeCheckRefreshTokenStub();
  const createAccessTokenStub = makeCreateAccessTokenStub();
  const validationStub = makeValidationStub();

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

    jest
      .spyOn(checkRefreshTokenStub, "check")
      .mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(serverError());
  });

  test("should return 500 if createAccessTokenStub has any error", async () => {
    const { sut, createAccessTokenStub } = makeSut();

    jest.spyOn(createAccessTokenStub, "create").mockImplementation(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(serverError());
  });

  test("should return 400 if checkRefreshToken returns null", async () => {
    const { sut, checkRefreshTokenStub } = makeSut();
    jest.spyOn(checkRefreshTokenStub, "check").mockReturnValueOnce(null);
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(unauthorized());
  });

  test("should checkRefreshToken is called with correct accessToken", async () => {
    const { sut, checkRefreshTokenStub } = makeSut();
    const checkRefreshTokenSpy = jest.spyOn(checkRefreshTokenStub, "check");
    await sut.handle(makeFakeHttpRequest());

    expect(checkRefreshTokenSpy).toBeCalledWith("valid_access_token");
  });

  test("should create access is called with correct id", async () => {
    const { sut, createAccessTokenStub } = makeSut();
    const createAccessTokenSpy = jest.spyOn(createAccessTokenStub, "create");
    await sut.handle(makeFakeHttpRequest());

    expect(createAccessTokenSpy).toBeCalledWith("valid_user_id");
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

    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new InvalidParamError("refreshtoken"));

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(
      badRequest(new InvalidParamError("refreshtoken"))
    );
  });
});
