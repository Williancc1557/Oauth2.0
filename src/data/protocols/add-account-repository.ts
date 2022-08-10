import type { AccountModel } from "../../domain/models/account";
import type { AddAccountInput } from "../../domain/usecase/add-account";
import type { CreateAccessTokenOutput } from "./create-access-token";
export interface AddAccountRepository {
  add: (
    account: AddAccountInput
  ) => Promise<AccountModel & CreateAccessTokenOutput>;
}
