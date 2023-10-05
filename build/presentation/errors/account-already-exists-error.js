"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAlreadyExistsError = void 0;
class AccountAlreadyExistsError extends Error {
    constructor() {
        super("User already exists");
        this.name = "AccountAlreadyExistsError";
    }
}
exports.AccountAlreadyExistsError = AccountAlreadyExistsError;
