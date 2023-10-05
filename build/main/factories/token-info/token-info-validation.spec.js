"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const required_field_validation_1 = require("../../../presentation/helpers/validators/required-field-validation/required-field-validation");
const validation_composite_1 = require("../../../presentation/helpers/validators/validation-composite");
const token_info_validation_1 = require("./token-info-validation");
jest.mock("../../../presentation/helpers/validators/validation-composite");
describe("TokenInfo Validation", () => {
    test("should call ValidationComposite with valid Validations", () => {
        (0, token_info_validation_1.makeTokenInfoValidation)();
        const validations = [];
        for (const field of ["accesstoken"]) {
            validations.push(new required_field_validation_1.RequiredFieldValidation(field));
        }
        expect(validation_composite_1.ValidationComposite).toBeCalledWith(validations);
    });
});
