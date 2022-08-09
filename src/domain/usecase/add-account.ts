import type { AccountModel } from "../../domain/models/account";

export interface AddAccountInput {
  name: string;
  email: string;
  password: string;
}

export interface AccessTokenType {
  accessToken: string;
}

export interface AddAccount {
  add: (account: AddAccountInput) => Promise<AccessTokenType & AccountModel>;
}
