import { MissingParamError } from "../../errors";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import type { Validation } from "../../protocols/validation";
import type {
  GetTokenInfo,
  GetTokenInfoOutput,
} from "../../protocols/get-token-info";
import type { VerifyAccessToken } from "../../protocols/verify-access-token";
import { TokenInfoController } from "./token-info";

const makeFakeHttpRequest = () => ({
  header: {
    accesstoken: "valid_access_token",
  },
});

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeVerifyAccessTokenStub = () => {
  class VerifyAccessTokenStub implements VerifyAccessToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public verify(accesstoken: string): boolean {
      return true;
    }
  }

  return new VerifyAccessTokenStub();
};

const makeGetTokenInfoStub = () => {
  class GetTokenInfoStub implements GetTokenInfo {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public get(token: string): GetTokenInfoOutput {
      return {
        accountId: "valid_id",
        exp: 12345,
        iat: 12345,
      };
    }
  }

  return new GetTokenInfoStub();
};

const makeSut = () => {
  const getTokenInfoStub = makeGetTokenInfoStub();
  const verifyAccessTokenStub = makeVerifyAccessTokenStub();
  const validationStub = makeValidationStub();

  const sut = new TokenInfoController(
    getTokenInfoStub,
    verifyAccessTokenStub,
    validationStub
  );

  return {
    sut,
    getTokenInfoStub,
    verifyAccessTokenStub,
    validationStub,
  };
};

describe("TokenInfo controller", () => {
  test("should return statusCode 400 if accessToken is not valid", async () => {
    const { sut, verifyAccessTokenStub } = makeSut();
    jest.spyOn(verifyAccessTokenStub, "verify").mockReturnValueOnce(false);
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(unauthorized());
  });

  test("should call getTokenInfo with valid values", async () => {
    const { sut, getTokenInfoStub } = makeSut();
    const getTokenInfoSpy = jest.spyOn(getTokenInfoStub, "get");
    await sut.handle(makeFakeHttpRequest());

    expect(getTokenInfoSpy).toHaveBeenCalledWith("valid_access_token");
  });

  test("should return statusCode 500 if GetTokenInfo dependency throws", async () => {
    const { sut, getTokenInfoStub } = makeSut();

    jest.spyOn(getTokenInfoStub, "get").mockImplementation(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(serverError());
  });

  test("should return statusCode 200 and valid body if success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(
      ok({
        accountId: "valid_id",
        exp: 12345,
        iat: 12345,
      })
    );
  });

  test("should call Validation with valid values", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    await sut.handle(makeFakeHttpRequest());

    expect(validateSpy).toHaveBeenCalledWith(makeFakeHttpRequest().header);
  });

  test("should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("email"));
    const httpRequest = await sut.handle(makeFakeHttpRequest());

    expect(httpRequest).toStrictEqual(
      badRequest(new MissingParamError("email"))
    );
  });
});
