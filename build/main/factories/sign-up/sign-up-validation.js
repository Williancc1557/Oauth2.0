"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSignUpValidation = void 0;
const email_validation_1 = require("../../../presentation/helpers/validators/email-validation/email-validation");
const name_validation_1 = require("../../../presentation/helpers/validators/name-validation/name-validation");
const password_validation_1 = require("../../../presentation/helpers/validators/password-validation/password-validation");
const required_field_validation_1 = require("../../../presentation/helpers/validators/required-field-validation/required-field-validation");
const validation_composite_1 = require("../../../presentation/helpers/validators/validation-composite");
const utils_1 = require("../../../utils");
const makeSignUpValidation = () => {
    const validations = [];
    for (const field of ["name", "password", "email"]) {
        validations.push(new required_field_validation_1.RequiredFieldValidation(field));
    }
    validations.push(new email_validation_1.EmailValidation("email", new utils_1.UtilValidateEmail()));
    validations.push(new name_validation_1.NameValidation("name", new utils_1.UtilNameValidator()));
    validations.push(new password_validation_1.PasswordValidation("password", new utils_1.UtilPasswordValidator()));
    return new validation_composite_1.ValidationComposite(validations);
};
exports.makeSignUpValidation = makeSignUpValidation;
