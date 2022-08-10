import type { CreateAccessTokenOutput } from "../../data/protocols";
import type { AccountModel } from "../../domain/models/account";

export interface AddAccountInput {
  name: string;
  email: string;
  password: string;
}

export interface AddAccount {
  add: (
    account: AddAccountInput
  ) => Promise<AccountModel & CreateAccessTokenOutput>;
}
