import type { AccountModel } from "../../domain/models/account";

export interface AddAccountInput {
  name: string;
  email: string;
  password: string;
}

export interface AcessTokenType {
  acessToken: string;
}

export interface AddAccount {
  add: (account: AddAccountInput) => Promise<AccountModel & AcessTokenType>;
}
