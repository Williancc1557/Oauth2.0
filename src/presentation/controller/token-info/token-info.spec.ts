import type { IsValidRefreshToken } from "../../../domain/usecase/is-valid-refresh-token";
import type { RequiredParams } from "../../protocols";
import type {
  GetTokenInfo,
  GetTokenInfoOutput,
} from "../../protocols/get-token-info";
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

const makeIsValidRefreshTokenStub = () => {
  class IsValidRefreshTokenStub implements IsValidRefreshToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async check(refreshToken: string): Promise<boolean> {
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

  const sut = new TokenInfoController(
    requiredParamsStub,
    getTokenInfoStub,
    isValidRefreshTokenStub
  );

  return {
    sut,
    getTokenInfoStub,
    requiredParamsStub,
    isValidRefreshTokenStub,
  };
};

describe("TokenInfo controller", () => {
  test("should return statusCode 400 if any param requested is not provided", async () => {
    const { sut, requiredParamsStub } = makeSut();

    jest.spyOn(requiredParamsStub, "check").mockReturnValueOnce("refreshToken");

    const httpRequest = {
      accessToken: "valid_access_token",
    };

    const res = await sut.handle({ body: httpRequest });

    expect(res.statusCode).toBe(400);
  });

  test("should return statusCode 400 if refreshToken is not valid", async () => {
    const { sut, isValidRefreshTokenStub } = makeSut();

    jest.spyOn(isValidRefreshTokenStub, "check").mockResolvedValueOnce(false);

    const httpRequest = {
      accessToken: "valid_access_token",
    };

    const res = await sut.handle({ body: httpRequest });

    expect(res.statusCode).toBe(400);
  });
});