type UserId = string;

export interface CheckRefreshToken {
  check: (acessToken: string) => UserId | undefined;
}
