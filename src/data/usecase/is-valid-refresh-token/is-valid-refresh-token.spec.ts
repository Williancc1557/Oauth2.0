import type { AccountModel } from "../../../domain/models/account";
import type { GetAccountById } from "../../protocols/get-account-by-id";
import { IsValidRefreshTokenRepository } from "./is-valid-refresh-token";

const makeGetAccountByIdStub = () => {
  class GetAccountByIdStub implements GetAccountById {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async get(accountId: string): Promise<AccountModel> {
      return {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        refreshToken: "refresh_token",
      };
    }
  }

  return new GetAccountByIdStub();
};

const makeSut = () => {
  const getAccountByIdStub = makeGetAccountByIdStub();
  const sut = new IsValidRefreshTokenRepository(getAccountByIdStub);

  return {
    sut,
    getAccountByIdStub,
  };
};

describe("IsValidRefreshTokenRepository", () => {
  test("should return false if getAccountByRefreshToken returns undefined", async () => {
    const { sut, getAccountByIdStub } = makeSut();

    jest.spyOn(getAccountByIdStub, "get").mockResolvedValueOnce(undefined);

    const res = await sut.check("refresh_token", "valid_id");

    expect(res).toBe(false);
  });

  test("should throws if getAccountByRefreshToken throw", async () => {
    const { sut, getAccountByIdStub } = makeSut();

    jest.spyOn(getAccountByIdStub, "get").mockRejectedValueOnce(new Error());

    await expect(sut.check("refresh_token", "valid_id")).rejects.toThrow();
  });

  test("should return true if success", async () => {
    const { sut } = makeSut();

    const res = await sut.check("refresh_token", "valid_id");

    expect(res).toBe(true);
  });
});
