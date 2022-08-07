export interface ResetRefreshToken {
  reset: (userId: string) => Promise<string>;
}
