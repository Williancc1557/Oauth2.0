type UserId = string;

export interface CheckRefreshToken {
  check: (refreshToken: string) => Promise<UserId | undefined>;
}
