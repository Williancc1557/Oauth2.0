type UserId = string;

export interface CheckRefreshToken {
  check: (acessToken: string) => Promise<UserId | undefined>;
}
