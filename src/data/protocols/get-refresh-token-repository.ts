import type { AccountModel } from "../../domain/models/account";

export interface GetRefreshTokenRepository {
  get: (userId: string) => Promise<AccountModel | undefined>;
}
