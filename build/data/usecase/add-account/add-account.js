"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbAddAccount = void 0;
class DbAddAccount {
    constructor(addAccountRepository, encrypter) {
        this.addAccountRepository = addAccountRepository;
        this.encrypter = encrypter;
    }
    async add(account) {
        const hashedPassword = await this.encrypter.hash(account.password);
        const accountData = await this.addAccountRepository.add({
            ...account,
            password: hashedPassword,
        });
        return accountData;
    }
}
exports.DbAddAccount = DbAddAccount;
