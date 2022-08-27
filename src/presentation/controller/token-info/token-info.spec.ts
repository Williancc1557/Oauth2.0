import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import type { RequiredParams } from "../../protocols";
import type {
  GetTokenInfo,
  GetTokenInfoOutput,
} from "../../protocols/get-token-info";
import type { VerifyAccessToken } from "../../protocols/verify-access-token";
import { TokenInfoController } from "./token-info";

const makeFakeHttpRequest = () => ({
  header: {
    refreshtoken: "valid_refresh_token",
    accesstoken: "valid_access_token",
  },
});

const makeRequiredParamsStub = () => {
  class RequiredParamsStub implements RequiredParams {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public check(requiredParams: Array<string>, body: any): string {
      return;
    }
  }

  return new RequiredParamsStub();
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
  const requiredParamsStub = makeRequiredParamsStub();
  const getTokenInfoStub = makeGetTokenInfoStub();
  const verifyAccessTokenStub = makeVerifyAccessTokenStub();

  const sut = new TokenInfoController(
    requiredParamsStub,
    getTokenInfoStub,
    verifyAccessTokenStub
  );

  return {
    sut,
    getTokenInfoStub,
    requiredParamsStub,
    verifyAccessTokenStub,
  };
};

describe("TokenInfo controller", () => {
  test("should return statusCode 400 if any param requested is not provided", async () => {
    const { sut, requiredParamsStub } = makeSut();
    jest.spyOn(requiredParamsStub, "check").mockReturnValueOnce("refreshtoken");

    const httpRequest = {
      accesstoken: "valid_access_token",
    };

    const httpResponse = await sut.handle({ header: httpRequest });

    expect(httpResponse).toStrictEqual(
      badRequest(new MissingParamError("refreshtoken"))
    );
  });

  test("should return statusCode 400 if accessToken is not valid", async () => {
    const { sut, verifyAccessTokenStub } = makeSut();
    jest.spyOn(verifyAccessTokenStub, "verify").mockReturnValueOnce(false);
    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toStrictEqual(
      badRequest(new InvalidParamError("accessToken"))
    );
  });

  test("should call getTokenInfo with valid values", async () => {
    const { sut, getTokenInfoStub } = makeSut();
    const getTokenInfoSpy = jest.spyOn(getTokenInfoStub, "get");
    await sut.handle(makeFakeHttpRequest());

    expect(getTokenInfoSpy).toBeCalledWith("valid_access_token");
  });

  test("should return statusCode 500 if any dependency throws", async () => {
    const { sut, getTokenInfoStub, requiredParamsStub } = makeSut();

    jest.spyOn(getTokenInfoStub, "get").mockImplementation(() => {
      throw new Error();
    });

    jest.spyOn(requiredParamsStub, "check").mockImplementation(() => {
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
});
