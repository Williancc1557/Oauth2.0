"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbGetAccountByEmail = void 0;
class DbGetAccountByEmail {
    constructor(getAccountByEmailRepository) {
        this.getAccountByEmailRepository = getAccountByEmailRepository;
    }
    async get(email) {
        return this.getAccountByEmailRepository.get(email);
    }
}
exports.DbGetAccountByEmail = DbGetAccountByEmail;
