export interface GetTokenInfoOutput {
  exp: number;
  iat: number;
  accountId: string;
}

export interface GetTokenInfo {
  get: (token: string) => GetTokenInfoOutput;
}
