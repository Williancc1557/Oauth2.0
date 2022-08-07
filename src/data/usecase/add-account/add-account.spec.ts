import type { AccountModel } from "../../../domain/models/account";
import type { AddAccountInput } from "../../../domain/usecase/add-account";
import type {
  AcessTokenType,
  AddAccountRepository,
} from "../../protocols/add-account-repository";
import type { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./add-account";

const makeAddAccountRepositoryStub = () => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    public async add(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      account: AddAccountInput
    ): Promise<AccountModel & AcessTokenType> {
      return {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "hashed_password",
        refreshToken: "valid_refreshToken",
        acessToken: "valid_acessToken",
      };
    }
  }

  return new AddAccountRepositoryStub();
};

const makeEncrypterStub = () => {
  class EncrypterStub implements Encrypter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async hash(value: string): Promise<string> {
      return "hashed_value";
    }

    public compare: (value: string, hashedValue: string) => Promise<boolean>;
  }

  return new EncrypterStub();
};

const makeSut = () => {
  const addAccountRepositoryStub = makeAddAccountRepositoryStub();
  const encrypterStub = makeEncrypterStub();
  const sut = new DbAddAccount(addAccountRepositoryStub, encrypterStub);

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
      acessToken: "valid_acessToken",
    });
  });
});
