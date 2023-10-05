"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTokenInfoValidation = void 0;
const required_field_validation_1 = require("../../../presentation/helpers/validators/required-field-validation/required-field-validation");
const validation_composite_1 = require("../../../presentation/helpers/validators/validation-composite");
const makeTokenInfoValidation = () => {
    const validations = [];
    for (const field of ["accesstoken"]) {
        validations.push(new required_field_validation_1.RequiredFieldValidation(field));
    }
    return new validation_composite_1.ValidationComposite(validations);
};
exports.makeTokenInfoValidation = makeTokenInfoValidation;
