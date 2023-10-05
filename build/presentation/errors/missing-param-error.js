"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingParamError = void 0;
class MissingParamError extends Error {
    constructor(paramName) {
        super(`Missing param: ${paramName}`);
        this.name = "MissingParamError";
    }
}
exports.MissingParamError = MissingParamError;
