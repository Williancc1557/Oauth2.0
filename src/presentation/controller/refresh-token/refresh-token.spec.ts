import { RefreshTokenController } from "./refresh-token";
import type { CheckRefreshToken } from "../../protocols/check-refresh-token";
import type { CreateAcessToken } from "../../protocols/create-acess-token";

const makeCheckRefreshTokenStub = (): CheckRefreshToken => {
  class CheckRefreshToken implements CheckRefreshToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async check(refreshToken: string): Promise<string | undefined> {
      return "valid_user_id";
    }
  }

  return new CheckRefreshToken();
};

const makeCreateAcessTokenStub = (): CreateAcessToken => {
  class CreateAcessToken implements CreateAcessToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public create(userId: string): string {
      return "valid_acess_token";
    }
  }

  return new CreateAcessToken();
};

const makeSut = () => {
  const checkRefreshTokenStub = makeCheckRefreshTokenStub();
  const createAcessTokenStub = makeCreateAcessTokenStub();
  const sut = new RefreshTokenController(
    checkRefreshTokenStub,
    createAcessTokenStub
  );

  return {
    sut,
    checkRefreshTokenStub,
    createAcessTokenStub,
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
        refreshToken: "valid_acess_token",
      },
    });

    expect(req.statusCode).toBe(500);
  });

  test("should return internalServerError if createAcessTokenStub has any error", async () => {
    const { sut, createAcessTokenStub } = makeSut();

    jest.spyOn(createAcessTokenStub, "create").mockImplementation(() => {
      throw new Error();
    });

    const req = await sut.handle({
      body: {
        refreshToken: "valid_acess_token",
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
        refreshToken: "valid_acess_token",
      },
    });

    expect(req.statusCode).toBe(400);
  });

  test("should checkRefreshToken is called with correct values", async () => {
    const { sut, checkRefreshTokenStub } = makeSut();

    const checkRefreshTokenSpy = jest.spyOn(checkRefreshTokenStub, "check");

    await sut.handle({
      body: {
        refreshToken: "valid_acess_token",
      },
    });

    expect(checkRefreshTokenSpy).toBeCalledWith("valid_acess_token");
  });

  test("should create acess is called with correct values", async () => {
    const { sut, createAcessTokenStub } = makeSut();

    const createAcessTokenSpy = jest.spyOn(createAcessTokenStub, "create");

    await sut.handle({
      body: {
        refreshToken: "valid_acess_token",
      },
    });

    expect(createAcessTokenSpy).toBeCalledWith("valid_user_id");
  });

  test("should return statusCode 200 if succefull", async () => {
    const { sut } = makeSut();

    const req = await sut.handle({
      body: {
        refreshToken: "valid_acess_token",
      },
    });

    expect(req.statusCode).toBe(200);
  });
});
