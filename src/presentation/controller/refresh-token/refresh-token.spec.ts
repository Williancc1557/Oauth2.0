import { RefreshTokenController } from "./refresh-token";
import type { CheckRefreshToken } from "../../protocols/check-refresh-token";

const makeCheckRefreshTokenStub = (): CheckRefreshToken => {
  class CheckRefreshToken implements CheckRefreshToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public check(acessToken: string): string | undefined {
      return "valid_user_id";
    }
  }

  return new CheckRefreshToken();
};

const makeSut = () => {
  const checkRefreshTokenStub = makeCheckRefreshTokenStub();
  const sut = new RefreshTokenController(checkRefreshTokenStub);

  return {
    sut,
    checkRefreshTokenStub,
  };
};

describe("RefreshToken Controller", () => {
  test("should return 400 if acessToken is not provided", async () => {
    const { sut } = makeSut();

    const req = await sut.handle({});

    expect(req.statusCode).toBe(400);
  });

  test("should return 400 if acessToken is invalid", async () => {
    const { sut, checkRefreshTokenStub } = makeSut();

    jest.spyOn(checkRefreshTokenStub, "check").mockReturnValueOnce(undefined);

    const req = await sut.handle({
      body: {
        acessToken: "valid_acess_token",
      },
    });

    expect(req.statusCode).toBe(400);
  });
});
