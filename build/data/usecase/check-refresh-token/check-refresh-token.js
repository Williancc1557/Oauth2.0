"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbCheckRefreshToken = void 0;
class DbCheckRefreshToken {
    constructor(getRefreshTokenRepository) {
        this.getRefreshTokenRepository = getRefreshTokenRepository;
    }
    async check(refreshToken) {
        const account = await this.getRefreshTokenRepository.get(refreshToken);
        return account === null || account === void 0 ? void 0 : account.id;
    }
}
exports.DbCheckRefreshToken = DbCheckRefreshToken;
