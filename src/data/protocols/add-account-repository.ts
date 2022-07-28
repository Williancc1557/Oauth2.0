import type { AccountModel } from "../../domain/models/account";
import type { AddAccountInput } from "../../domain/usecase/add-account";

export interface AddAccountRepository {
    add: (account: AddAccountInput) => Promise<AccountModel>;
}