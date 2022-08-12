import type { AccountModel } from "../../domain/models/account";

export interface GetAccountById {
  get: (accountId: string) => Promise<AccountModel | undefined>;
}
