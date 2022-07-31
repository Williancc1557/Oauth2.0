import type { AccountModel } from "../../../domain/models/account";
import type {
  AddAccount,
  AddAccountInput,
} from "../../../domain/usecase/add-account";
import type { AddAccountRepository } from "../../protocols/add-account-repository";
import type { Encrypter } from "../../protocols/encrypter";

export class DbAddAccount implements AddAccount {
  public constructor(
    private readonly addAccountRepository: AddAccountRepository,
    private readonly encrypter: Encrypter
  ) {}

  public async add(account: AddAccountInput): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.hash(account.password);
    const accountData = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword,
    });
    return accountData;
  }
}
