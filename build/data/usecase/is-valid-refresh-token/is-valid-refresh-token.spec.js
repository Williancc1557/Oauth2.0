"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_valid_refresh_token_1 = require("./is-valid-refresh-token");
const makeGetAccountByIdStub = () => {
    class GetAccountByIdStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async get(accountId) {
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
    const sut = new is_valid_refresh_token_1.DbIsValidRefreshToken(getAccountByIdStub);
    return {
        sut,
        getAccountByIdStub,
    };
};
describe("DbIsValidRefreshToken", () => {
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
