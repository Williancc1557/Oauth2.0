import type { AccountModel } from "../../../domain/models/account";
import type { AddAccountInput } from "../../../domain/usecase/add-account";
import type { AddAccountRepository } from "../../protocols/add-account-repository";
import { DbAddAccount } from "./add-account";

const makeAddAccountRepositoryStub = () => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public async add(account: AddAccountInput): Promise<AccountModel> {
            return {
                id: "valid_id",
                name: "valid_name",
                email: "valid_email@mail.com",
                password: "valid_password",
                refreshToken: "valid_refreshToken",
            };
        }
    }

    return new AddAccountRepositoryStub();
};


const makeSut = () => {
    const addAccountRepositoryStub = makeAddAccountRepositoryStub();
    const sut = new DbAddAccount(addAccountRepositoryStub);

    return {
        sut,
        addAccountRepositoryStub,
    };
};

describe("DbAddAccount", () => {
    test("should throw if addAccountRepository throws", async () => {
        const { sut, addAccountRepositoryStub } = makeSut();

        jest.spyOn(addAccountRepositoryStub, "add").mockRejectedValueOnce(new Error());

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
            password: "valid_password",
        });
    });

    test("should return account if sucess", async () => {
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
            password: "valid_password",
            refreshToken: "valid_refreshToken",
        });
    });
});