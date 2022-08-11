export interface IsValidRefreshToken {
  check: (refreshToken: string) => Promise<boolean>;
}
