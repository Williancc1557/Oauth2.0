"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordValidation = void 0;
const errors_1 = require("../../../errors");
class PasswordValidation {
    constructor(fieldPassword, passwordValidator) {
        this.fieldPassword = fieldPassword;
        this.passwordValidator = passwordValidator;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input) {
        const password = input[this.fieldPassword];
        const isValidPassword = this.passwordValidator.validate(password);
        if (!isValidPassword) {
            return new errors_1.InvalidParamError(this.fieldPassword);
        }
    }
}
exports.PasswordValidation = PasswordValidation;
