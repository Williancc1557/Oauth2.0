import type { IsValidRefreshToken } from "../../../domain/usecase/is-valid-refresh-token";
import type { GetAccountById } from "../../protocols/get-account-by-id";

export class IsValidRefreshTokenRepository implements IsValidRefreshToken {
  public constructor(private readonly getAccountById: GetAccountById) {}

  public async check(
    refreshToken: string,
    accountId: string
  ): Promise<boolean> {
    const account = await this.getAccountById.get(accountId);

    return account?.refreshToken == refreshToken ? true : false;
  }
}
