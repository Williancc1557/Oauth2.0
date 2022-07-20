import { RefreshTokenController } from "./refresh-token";
import type { CheckRefreshToken } from "../../protocols/check-refresh-token";
import type { CreateAcessToken } from "../../protocols/create-acess-token";

const makeCheckRefreshTokenStub = (): CheckRefreshToken => {
  class CheckRefreshToken implements CheckRefreshToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public check(refreshToken: string): string | undefined {
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
  const createAcessToken = makeCreateAcessTokenStub();
  const sut = new RefreshTokenController(
    checkRefreshTokenStub,
    createAcessToken
  );

  return {
    sut,
    checkRefreshTokenStub,
    createAcessToken,
  };
};

describe("RefreshToken Controller", () => {
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

  test("should create acess is called with correct values", async () => {
    const { sut, createAcessToken } = makeSut();

    const createAcessTokenStub = jest.spyOn(createAcessToken, "create");

    await sut.handle({
      body: {
        refreshToken: "valid_acess_token",
      },
    });

    expect(createAcessTokenStub).toBeCalledWith("valid_user_id");
  });
});
