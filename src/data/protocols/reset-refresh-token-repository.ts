export interface ResetRefreshTokenRepository {
  reset: (userId: string) => Promise<string>;
}
