"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredFieldValidation = void 0;
const errors_1 = require("../../../errors");
class RequiredFieldValidation {
    constructor(fieldName) {
        this.fieldName = fieldName;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input) {
        if (!input[this.fieldName]) {
            return new errors_1.MissingParamError(this.fieldName);
        }
    }
}
exports.RequiredFieldValidation = RequiredFieldValidation;
