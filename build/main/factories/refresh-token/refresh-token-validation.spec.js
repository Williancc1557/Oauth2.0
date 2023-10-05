"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const required_field_validation_1 = require("../../../presentation/helpers/validators/required-field-validation/required-field-validation");
const validation_composite_1 = require("../../../presentation/helpers/validators/validation-composite");
const refresh_token_validation_1 = require("./refresh-token-validation");
jest.mock("../../../presentation/helpers/validators/validation-composite");
describe("TokenInfo Validation", () => {
    test("should call ValidationComposite with valid Validations", () => {
        (0, refresh_token_validation_1.makeRefreshTokenValidation)();
        const validations = [];
        for (const field of ["refreshtoken"]) {
            validations.push(new required_field_validation_1.RequiredFieldValidation(field));
        }
        expect(validation_composite_1.ValidationComposite).toBeCalledWith(validations);
    });
});
