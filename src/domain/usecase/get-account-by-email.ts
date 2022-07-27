import type { AccountModel } from "../models/account";

export interface GetAccountByEmail {
  get: (email: string) => Promise<AccountModel | undefined>;
}
