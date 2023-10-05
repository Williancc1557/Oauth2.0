"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidParamError = void 0;
class InvalidParamError extends Error {
    constructor(paramName) {
        super(`Invalid param: ${paramName}`);
        this.name = "InvalidParamError";
    }
}
exports.InvalidParamError = InvalidParamError;
