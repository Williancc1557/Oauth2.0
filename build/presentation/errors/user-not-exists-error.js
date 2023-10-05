"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotExistsError = void 0;
class UserNotExistsError extends Error {
    constructor() {
        super("User not exists error");
        this.name = "UserNotExistsError";
    }
}
exports.UserNotExistsError = UserNotExistsError;
