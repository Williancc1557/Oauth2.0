import type { IsValidRefreshToken } from "../../../domain/usecase/is-valid-refresh-token";
import type { GetAccountByIdRepository } from "../../protocols/get-account-by-id-repository";

export class DbIsValidRefreshToken implements IsValidRefreshToken {
  public constructor(
    private readonly getAccountById: GetAccountByIdRepository
  ) {}

  public async check(
    refreshToken: string,
    accountId: string
  ): Promise<boolean> {
    const account = await this.getAccountById.get(accountId);

    return account?.refreshToken == refreshToken ? true : false;
  }
}
