"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbIsValidRefreshToken = void 0;
class DbIsValidRefreshToken {
    constructor(getAccountById) {
        this.getAccountById = getAccountById;
    }
    async check(refreshToken, accountId) {
        const account = await this.getAccountById.get(accountId);
        return (account === null || account === void 0 ? void 0 : account.refreshToken) == refreshToken ? true : false;
    }
}
exports.DbIsValidRefreshToken = DbIsValidRefreshToken;
