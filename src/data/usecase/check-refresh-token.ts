import type { CheckRefreshToken } from "../../domain/usecase/check-refresh-token";
import type { GetRefreshTokenRepository } from "../protocols/get-refresh-token-repository";

export class DbCheckRefreshToken implements CheckRefreshToken {
  public constructor(
    private readonly getRefreshTokenRepository: GetRefreshTokenRepository
  ) {}

  public async check(refreshToken: string): Promise<string> {
    const account = await this.getRefreshTokenRepository.get(refreshToken);

    if (!account) {
      return undefined;
    }

    return account.id;
  }
}
