"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../errors");
const required_field_validation_1 = require("./required-field-validation");
const makeSut = () => {
    const sut = new required_field_validation_1.RequiredFieldValidation("email");
    return {
        sut,
    };
};
describe("RequiredField validation", () => {
    test("should return MissingParamError if the field is not provided", () => {
        const { sut } = makeSut();
        const res = sut.validate({});
        expect(res).toStrictEqual(new errors_1.MissingParamError("email"));
    });
    test("should return null if validation succeeds", () => {
        const { sut } = makeSut();
        const res = sut.validate({});
        expect(res).toStrictEqual(new errors_1.MissingParamError("email"));
    });
});
