"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailValidation = void 0;
const errors_1 = require("../../../errors");
class EmailValidation {
    constructor(fieldName, emailValidator) {
        this.fieldName = fieldName;
        this.emailValidator = emailValidator;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input) {
        const email = input[this.fieldName];
        const isValidEmail = this.emailValidator.validate(email);
        if (!isValidEmail) {
            return new errors_1.InvalidParamError(this.fieldName);
        }
    }
}
exports.EmailValidation = EmailValidation;
