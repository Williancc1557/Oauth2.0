export interface CreateAccessTokenOutput {
  accessToken: string;
  expires: number;
}

export interface CreateAccessToken {
  create: (userId: string) => CreateAccessTokenOutput;
}
