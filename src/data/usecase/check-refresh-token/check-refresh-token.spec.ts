import type { AccountModel } from "../../../domain/models/account";
import type { GetRefreshTokenRepository } from "../../protocols/get-refresh-token-repository";
import { DbCheckRefreshToken } from "./check-refresh-token";

const makeGetRefreshTokenStub = () => {
  class GetRefreshTokenStub implements GetRefreshTokenRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async get(refreshToken: string): Promise<AccountModel> {
      return {
        id: "valid_id",
        email: "valid_email@mail.com",
        name: "valid_name",
        password: "valid_password",
        refreshToken: "valid_refresh_token",
      };
    }
  }

  return new GetRefreshTokenStub();
};

const makeSut = () => {
  const getRefreshTokenStub = makeGetRefreshTokenStub();
  const sut = new DbCheckRefreshToken(getRefreshTokenStub);

  return {
    sut,
    getRefreshTokenStub,
  };
};

describe("CheckRefreshToken", () => {
  test("should return undefined if account don't exists", async () => {
    const { sut, getRefreshTokenStub } = makeSut();

    jest.spyOn(getRefreshTokenStub, "get").mockResolvedValueOnce(undefined);

    const res = await sut.check("valid_refresh_token");

    expect(res).toBeUndefined();
  });

  test("should call getRefreshToken with correct values", async () => {
    const { sut, getRefreshTokenStub } = makeSut();

    const getRefreshTokenSpy = jest.spyOn(getRefreshTokenStub, "get");

    await sut.check("valid_refresh_token");

    expect(getRefreshTokenSpy).toBeCalledWith("valid_refresh_token");
  });

  test("should return account.id if success", async () => {
    const { sut } = makeSut();

    const res = await sut.check("valid_refresh_token");

    expect(res).toBe("valid_id");
  });
});
