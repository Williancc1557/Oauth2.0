import type { AccountModel } from "../../domain/models/account";

export interface GetRefreshTokenRepository {
  get: (refreshToken: string) => Promise<AccountModel | undefined>;
}
