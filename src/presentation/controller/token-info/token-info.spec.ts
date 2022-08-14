import type { IsValidRefreshToken } from "../../../domain/usecase/is-valid-refresh-token";
import type { RequiredParams } from "../../protocols";
import type {
  GetTokenInfo,
  GetTokenInfoOutput,
} from "../../protocols/get-token-info";
import type { VerifyAccessToken } from "../../protocols/verify-access-token";
import { TokenInfoController } from "./token-info";

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

const makeIsValidRefreshTokenStub = () => {
  class IsValidRefreshTokenStub implements IsValidRefreshToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async check(refreshtoken: string): Promise<boolean> {
      return true;
    }
  }

  return new IsValidRefreshTokenStub();
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
  const isValidRefreshTokenStub = makeIsValidRefreshTokenStub();
  const verifyAccessTokenStub = makeVerifyAccessTokenStub();

  const sut = new TokenInfoController(
    requiredParamsStub,
    getTokenInfoStub,
    isValidRefreshTokenStub,
    verifyAccessTokenStub
  );

  return {
    sut,
    getTokenInfoStub,
    requiredParamsStub,
    isValidRefreshTokenStub,
    verifyAccessTokenStub,
  };
};

describe("TokenInfo controller", () => {
  test("should return statusCode 400 if any param requested is not provided", async () => {
    const { sut, requiredParamsStub } = makeSut();

    jest.spyOn(requiredParamsStub, "check").mockReturnValueOnce("refreshToken");

    const httpRequest = {
      accesstoken: "valid_access_token",
    };

    const res = await sut.handle({ header: httpRequest });

    expect(res.statusCode).toBe(400);
  });

  test("should return statusCode 400 if accessToken is not valid", async () => {
    const { sut, verifyAccessTokenStub } = makeSut();

    jest.spyOn(verifyAccessTokenStub, "verify").mockReturnValueOnce(false);

    const httpRequest = {
      refreshtoken: "valid_refresh_token",
      accesstoken: "valid_access_token",
    };

    const res = await sut.handle({ header: httpRequest });

    expect(res.statusCode).toBe(400);
  });

  test("should return statusCode 400 if refreshToken is not valid", async () => {
    const { sut, isValidRefreshTokenStub } = makeSut();

    jest.spyOn(isValidRefreshTokenStub, "check").mockResolvedValueOnce(false);

    const httpRequest = {
      refreshtoken: "valid_refresh_token",
      accesstoken: "valid_access_token",
    };

    const res = await sut.handle({ header: httpRequest });

    expect(res.statusCode).toBe(400);
  });

  test("should call isValidRefreshToken with valid values", async () => {
    const { sut, isValidRefreshTokenStub } = makeSut();

    const isValidRefreshTokenSpy = jest.spyOn(isValidRefreshTokenStub, "check");

    const httpRequest = {
      refreshtoken: "valid_refresh_token",
      accesstoken: "valid_access_token",
    };

    await sut.handle({ header: httpRequest });

    expect(isValidRefreshTokenSpy).toBeCalledWith(
      "valid_refresh_token",
      "valid_id"
    );
  });

  test("should call getTokenInfo with valid values", async () => {
    const { sut, getTokenInfoStub } = makeSut();

    const getTokenInfoSpy = jest.spyOn(getTokenInfoStub, "get");

    const httpRequest = {
      refreshtoken: "valid_refresh_token",
      accesstoken: "valid_access_token",
    };

    await sut.handle({ header: httpRequest });

    expect(getTokenInfoSpy).toBeCalledWith("valid_access_token");
  });

  test("should return statusCode 500 if any dependency throws", async () => {
    const {
      sut,
      getTokenInfoStub,
      isValidRefreshTokenStub,
      requiredParamsStub,
    } = makeSut();

    jest.spyOn(getTokenInfoStub, "get").mockImplementation(() => {
      throw new Error();
    });
    jest
      .spyOn(isValidRefreshTokenStub, "check")
      .mockRejectedValueOnce(new Error());
    jest.spyOn(requiredParamsStub, "check").mockImplementation(() => {
      throw new Error();
    });

    const httpRequest = {
      refreshtoken: "valid_refresh_token",
      accesstoken: "valid_access_token",
    };

    expect((await sut.handle({ header: httpRequest })).statusCode).toBe(500);
  });

  test("should return statusCode 200 and valid body if success", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      refreshtoken: "valid_refresh_token",
      accesstoken: "valid_access_token",
      coidera: "aaa",
    };

    const res = await sut.handle({ header: httpRequest });

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({
      accountId: "valid_id",
      exp: 12345,
      iat: 12345,
    });
  });
});
