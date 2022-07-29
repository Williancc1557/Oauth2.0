import type { AccountModel } from "../../../domain/models/account";
import type { GetAccountByEmailRepository } from "../../protocols/get-account-by-email-repository";
import { DbGetAccountByEmail } from "./get-account-by-email";

const makeGetAccountByEmailRepositoryStub = () => {
     class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository  {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public async get(email: string): Promise<AccountModel> {
            return {
                id: "valid_id",
        email: "valid_email@mail.com",
        name: "valid_name",
        password: "valid_password",
        refreshToken: "valid_refresh_token",
            };
        }
     }

     return new GetAccountByEmailRepositoryStub();
};

const makeSut = () => {
    const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepositoryStub();
    const sut = new DbGetAccountByEmail(getAccountByEmailRepositoryStub);

    return {
        sut,
        getAccountByEmailRepositoryStub,
    };
};

describe("GetAccountByEmail", () => {
    test("should getAccountByEmailRepository is called with correct values", async () => {
        const { sut, getAccountByEmailRepositoryStub } = makeSut();

        const getAccountByEmailRepositorySpy = jest.spyOn(getAccountByEmailRepositoryStub, "get");

        await sut.get("valid_email@email.com");

        expect(getAccountByEmailRepositorySpy).toBeCalledWith("valid_email@email.com");
    });
});