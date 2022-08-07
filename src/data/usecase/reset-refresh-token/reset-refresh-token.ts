import type { ResetRefreshToken } from "../../../domain/usecase/reset-refresh-token";
import type { ResetRefreshTokenRepository } from "../../protocols/reset-refresh-token-repository";

export class DbResetRefreshToken implements ResetRefreshToken {
  public constructor(
    private readonly resetRefreshTokenRepository: ResetRefreshTokenRepository
  ) {}

  public async reset(userId: string): Promise<string> {
    return this.resetRefreshTokenRepository.reset(userId);
  }
}
