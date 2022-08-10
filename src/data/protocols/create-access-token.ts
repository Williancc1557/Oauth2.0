export interface CreateAccessTokenOutput {
  accessToken: string;
  expiresIn: number;
}

export interface CreateAccessToken {
  create: (userId: string) => CreateAccessTokenOutput;
}
