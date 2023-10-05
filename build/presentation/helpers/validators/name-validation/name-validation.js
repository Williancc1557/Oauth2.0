"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameValidation = void 0;
const errors_1 = require("../../../errors");
class NameValidation {
    constructor(fieldName, nameValidator) {
        this.fieldName = fieldName;
        this.nameValidator = nameValidator;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input) {
        const name = input[this.fieldName];
        const isValidName = this.nameValidator.validate(name);
        if (!isValidName) {
            return new errors_1.InvalidParamError(this.fieldName);
        }
    }
}
exports.NameValidation = NameValidation;
