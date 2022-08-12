import type { IsValidRefreshToken } from "../../../domain/usecase/is-valid-refresh-token";
import type { GetAccountByRefreshToken } from "../../protocols/get-account-by-refresh-token";

export class IsValidRefreshTokenRepository implements IsValidRefreshToken {
  public constructor(
    private readonly getAccountByRefreshToken: GetAccountByRefreshToken
  ) {}

  public async check(refreshToken: string): Promise<boolean> {
    const account = await this.getAccountByRefreshToken.get(refreshToken);

    return account ? true : false;
  }
}
