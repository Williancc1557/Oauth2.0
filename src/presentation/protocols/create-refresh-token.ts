export interface CreateRefreshToken {
  create: (userId: string) => string;
}
