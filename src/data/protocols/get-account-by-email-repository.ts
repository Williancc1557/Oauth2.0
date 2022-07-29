import type { AccountModel } from "../../domain/models/account";

export interface GetAccountByEmailRepository {
    get: (email: string) => Promise<AccountModel>;
}