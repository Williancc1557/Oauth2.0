"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbResetRefreshToken = void 0;
class DbResetRefreshToken {
    constructor(resetRefreshTokenRepository) {
        this.resetRefreshTokenRepository = resetRefreshTokenRepository;
    }
    async reset(userId) {
        return this.resetRefreshTokenRepository.reset(userId);
    }
}
exports.DbResetRefreshToken = DbResetRefreshToken;
