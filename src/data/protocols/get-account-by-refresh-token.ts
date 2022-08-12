import type { AccountModel } from "../../domain/models/account";

export interface GetAccountByRefreshToken {
  get: (refreshToken: string) => Promise<AccountModel>;
}
