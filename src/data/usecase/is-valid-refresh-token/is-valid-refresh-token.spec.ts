import type { AccountModel } from "../../../domain/models/account";
import type { GetAccountByRefreshToken } from "../../protocols/get-account-by-refresh-token";
import { IsValidRefreshTokenRepository } from "./is-valid-refresh-token";

const makeGetAccountByRefreshTokenStub = () => {
  class GetAccountByRefreshTokenStub implements GetAccountByRefreshToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async get(refreshToken: string): Promise<AccountModel> {
      return {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        refreshToken: "valid_refresh_token",
      };
    }
  }

  return new GetAccountByRefreshTokenStub();
};

const makeSut = () => {
  const getAccountByRefreshTokenStub = makeGetAccountByRefreshTokenStub();
  const sut = new IsValidRefreshTokenRepository(getAccountByRefreshTokenStub);

  return {
    sut,
    getAccountByRefreshTokenStub,
  };
};

describe("IsValidRefreshTokenRepository", () => {
  test("should return false if getAccountByRefreshToken returns undefined", async () => {
    const { sut, getAccountByRefreshTokenStub } = makeSut();

    jest
      .spyOn(getAccountByRefreshTokenStub, "get")
      .mockResolvedValueOnce(undefined);

    const res = await sut.check("refresh_token");

    expect(res).toBe(false);
  });
});
