"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reset_refresh_token_1 = require("./reset-refresh-token");
const makeResetRefreshTokenRepositoryStub = () => {
    class ResetRefreshTokenRepositoryStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async reset(userId) {
            return "refresh_token";
        }
    }
    return new ResetRefreshTokenRepositoryStub();
};
const makeSut = () => {
    const resetRefreshTokenRepositoryStub = makeResetRefreshTokenRepositoryStub();
    const sut = new reset_refresh_token_1.DbResetRefreshToken(resetRefreshTokenRepositoryStub);
    return {
        sut,
        resetRefreshTokenRepositoryStub,
    };
};
describe("DbResetRefreshToken", () => {
    test("should call resetRefreshToken with correct value", async () => {
        const { sut, resetRefreshTokenRepositoryStub } = makeSut();
        const resetRefreshTokenRepositorySpy = jest.spyOn(resetRefreshTokenRepositoryStub, "reset");
        const userId = "validUserId";
        await sut.reset(userId);
        expect(resetRefreshTokenRepositorySpy).toBeCalledWith("validUserId");
    });
    test("should return string if success", async () => {
        const { sut } = makeSut();
        const userId = "validUserId";
        const res = await sut.reset(userId);
        expect(res).toBe("refresh_token");
    });
});
