"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add_account_1 = require("./add-account");
const makeAddAccountRepositoryStub = () => {
    class AddAccountRepositoryStub {
        async add(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        account) {
            return {
                id: "valid_id",
                name: "valid_name",
                email: "valid_email@mail.com",
                password: "hashed_password",
                refreshToken: "valid_refreshToken",
                accessToken: "valid_accessToken",
                expiresIn: 300,
            };
        }
    }
    return new AddAccountRepositoryStub();
};
const makeEncrypterStub = () => {
    class EncrypterStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async hash(value) {
            return "hashed_value";
        }
    }
    return new EncrypterStub();
};
const makeSut = () => {
    const addAccountRepositoryStub = makeAddAccountRepositoryStub();
    const encrypterStub = makeEncrypterStub();
    const sut = new add_account_1.DbAddAccount(addAccountRepositoryStub, encrypterStub);
    return {
        sut,
        addAccountRepositoryStub,
        encrypterStub,
    };
};
describe("DbAddAccount", () => {
    test("should throw if addAccountRepository throws", async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        jest
            .spyOn(addAccountRepositoryStub, "add")
            .mockRejectedValueOnce(new Error());
        const req = sut.add({
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_password",
        });
        await expect(req).rejects.toThrow();
    });
    test("should check if addAccountRepository is called with valid value", async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, "add");
        await sut.add({
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_password",
        });
        expect(addAccountRepositorySpy).toBeCalledWith({
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "hashed_value",
        });
    });
    test("should return account if success", async () => {
        const { sut } = makeSut();
        const req = await sut.add({
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_password",
        });
        expect(req).toStrictEqual({
            id: "valid_id",
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "hashed_password",
            refreshToken: "valid_refreshToken",
            accessToken: "valid_accessToken",
            expiresIn: 300,
        });
    });
});
