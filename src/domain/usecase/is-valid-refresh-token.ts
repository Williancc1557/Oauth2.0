export interface IsValidRefreshToken {
  check: (refreshToken: string, accountId: string) => Promise<boolean>;
}
