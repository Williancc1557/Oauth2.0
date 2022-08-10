import { RefreshTokenController } from "./refresh-token";
import type {
  CreateAccessToken,
  CreateAccessTokenOutput,
} from "../../../data/protocols/create-access-token";
import type { CheckRefreshToken } from "../../../domain/usecase/check-refresh-token";

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
        expires: 300,
      };
    }
  }

  return new CreateAccessToken();
};

const makeSut = () => {
  const checkRefreshTokenStub = makeCheckRefreshTokenStub();
  const createAccessTokenStub = makeCreateAccessTokenStub();
  const sut = new RefreshTokenController(
    checkRefreshTokenStub,
    createAccessTokenStub
  );

  return {
    sut,
    checkRefreshTokenStub,
    createAccessTokenStub,
  };
};

describe("RefreshToken Controller", () => {
  test("should return internalServerError if checkRefreshToken has any error", async () => {
    const { sut, checkRefreshTokenStub } = makeSut();

    jest
      .spyOn(checkRefreshTokenStub, "check")
      .mockRejectedValueOnce(new Error());

    const req = await sut.handle({
      body: {
        refreshToken: "valid_access_token",
      },
    });

    expect(req.statusCode).toBe(500);
  });

  test("should return internalServerError if createAccessTokenStub has any error", async () => {
    const { sut, createAccessTokenStub } = makeSut();

    jest.spyOn(createAccessTokenStub, "create").mockImplementation(() => {
      throw new Error();
    });

    const req = await sut.handle({
      body: {
        refreshToken: "valid_access_token",
      },
    });

    expect(req.statusCode).toBe(500);
  });

  test("should return 400 if refreshToken is not provided", async () => {
    const { sut } = makeSut();

    const req = await sut.handle({});

    expect(req.statusCode).toBe(400);
  });

  test("should return 400 if refreshToken is invalid", async () => {
    const { sut, checkRefreshTokenStub } = makeSut();

    jest.spyOn(checkRefreshTokenStub, "check").mockReturnValueOnce(undefined);

    const req = await sut.handle({
      body: {
        refreshToken: "valid_access_token",
      },
    });

    expect(req.statusCode).toBe(400);
  });

  test("should checkRefreshToken is called with correct values", async () => {
    const { sut, checkRefreshTokenStub } = makeSut();

    const checkRefreshTokenSpy = jest.spyOn(checkRefreshTokenStub, "check");

    await sut.handle({
      body: {
        refreshToken: "valid_access_token",
      },
    });

    expect(checkRefreshTokenSpy).toBeCalledWith("valid_access_token");
  });

  test("should create access is called with correct values", async () => {
    const { sut, createAccessTokenStub } = makeSut();

    const createAccessTokenSpy = jest.spyOn(createAccessTokenStub, "create");

    await sut.handle({
      body: {
        refreshToken: "valid_access_token",
      },
    });

    expect(createAccessTokenSpy).toBeCalledWith("valid_user_id");
  });

  test("should return statusCode 200 if succefull", async () => {
    const { sut } = makeSut();

    const req = await sut.handle({
      body: {
        refreshToken: "valid_access_token",
      },
    });

    expect(req.statusCode).toBe(200);
  });
});
