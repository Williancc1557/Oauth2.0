import type { AccountModel } from "../../../domain/models/account";
import type { AddAccount, AddAccountInput } from "../../../domain/usecase/add-account";
import type { AddAccountRepository } from "../../protocols/add-account-repository";

export class DbAddAccount implements AddAccount {
    public constructor(
        private readonly addAccountRepository: AddAccountRepository
    ) { }

    public async add(account: AddAccountInput): Promise<AccountModel> {
        const accountData = await this.addAccountRepository.add(account);
        return accountData;
    }
}