import type { AccountModel } from "../../domain/models/account";

export interface GetAccountByIdRepository {
  get: (accountId: string) => Promise<AccountModel | undefined>;
}
