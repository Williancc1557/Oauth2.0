"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
class UnauthorizedError extends Error {
    constructor() {
        super("Unauthorized error");
        this.name = "UnauthorizedError";
    }
}
exports.UnauthorizedError = UnauthorizedError;
