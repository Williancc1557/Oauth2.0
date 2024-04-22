import type { CheckRefreshToken } from "../../domain/usecase/check-refresh-token";
import type { GetRefreshTokenRepository } from "../protocols";

export class DbCheckRefreshToken implements CheckRefreshToken {
  public constructor(
    private readonly getRefreshTokenRepository: GetRefreshTokenRepository
  ) {}

  public async check(refreshToken: string): Promise<string | undefined> {
    const account = await this.getRefreshTokenRepository.get(refreshToken);

    return account?.id;
  }
}
