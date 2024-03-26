import type { ResetRefreshTokenRepository } from "../../protocols/reset-refresh-token-repository";
import { DbResetRefreshToken } from "./reset-refresh-token";

const makeResetRefreshTokenRepositoryStub = () => {
  class ResetRefreshTokenRepositoryStub implements ResetRefreshTokenRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async reset(userId: string): Promise<string> {
      return "refresh_token";
    }
  }

  return new ResetRefreshTokenRepositoryStub();
};

const makeSut = () => {
  const resetRefreshTokenRepositoryStub = makeResetRefreshTokenRepositoryStub();
  const sut = new DbResetRefreshToken(resetRefreshTokenRepositoryStub);

  return {
    sut,
    resetRefreshTokenRepositoryStub,
  };
};

describe("DbResetRefreshToken", () => {
  test("should call resetRefreshToken with correct value", async () => {
    const { sut, resetRefreshTokenRepositoryStub } = makeSut();

    const resetRefreshTokenRepositorySpy = jest.spyOn(
      resetRefreshTokenRepositoryStub,
      "reset"
    );

    const userId = "validUserId";

    await sut.reset(userId);

    expect(resetRefreshTokenRepositorySpy).toHaveBeenCalledWith("validUserId");
  });

  test("should return string if success", async () => {
    const { sut } = makeSut();

    const userId = "validUserId";

    const res = await sut.reset(userId);

    expect(res).toBe("refresh_token");
  });
});
