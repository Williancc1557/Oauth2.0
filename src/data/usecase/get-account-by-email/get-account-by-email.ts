import type { AccountModel } from "../../../domain/models/account";
import type { GetAccountByEmail } from "../../../domain/usecase/get-account-by-email";

export class DbGetAccountByEmail implements GetAccountByEmail {
    public constructor(
        private readonly getAccountByEmailRepository: GetAccountByEmail
    ) {}

    public async get(email: string): Promise<AccountModel> {
        return this.getAccountByEmailRepository.get(email);
    }
}