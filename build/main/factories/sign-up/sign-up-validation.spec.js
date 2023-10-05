"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_validation_1 = require("../../../presentation/helpers/validators/email-validation/email-validation");
const name_validation_1 = require("../../../presentation/helpers/validators/name-validation/name-validation");
const password_validation_1 = require("../../../presentation/helpers/validators/password-validation/password-validation");
const required_field_validation_1 = require("../../../presentation/helpers/validators/required-field-validation/required-field-validation");
const validation_composite_1 = require("../../../presentation/helpers/validators/validation-composite");
const utils_1 = require("../../../utils");
const sign_up_validation_1 = require("./sign-up-validation");
jest.mock("../../../presentation/helpers/validators/validation-composite");
describe("TokenInfo Validation", () => {
    test("should call ValidationComposite with valid Validations", () => {
        (0, sign_up_validation_1.makeSignUpValidation)();
        const validations = [];
        for (const field of ["name", "password", "email"]) {
            validations.push(new required_field_validation_1.RequiredFieldValidation(field));
        }
        validations.push(new email_validation_1.EmailValidation("email", new utils_1.UtilValidateEmail()));
        validations.push(new name_validation_1.NameValidation("name", new utils_1.UtilNameValidator()));
        validations.push(new password_validation_1.PasswordValidation("password", new utils_1.UtilPasswordValidator()));
        expect(validation_composite_1.ValidationComposite).toBeCalledWith(validations);
    });
});
