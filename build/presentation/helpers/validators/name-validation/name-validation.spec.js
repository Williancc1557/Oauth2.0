"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../errors");
const name_validation_1 = require("./name-validation");
const makeNameValidator = () => {
    class NameValidatorStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(email) {
            return true;
        }
    }
    return new NameValidatorStub();
};
const makeSut = () => {
    const nameValidatorStub = makeNameValidator();
    const sut = new name_validation_1.NameValidation("name", nameValidatorStub);
    return {
        sut,
        nameValidatorStub,
    };
};
describe("Name Validation", () => {
    test("should return error if name is not valid", async () => {
        const { sut, nameValidatorStub } = makeSut();
        jest.spyOn(nameValidatorStub, "validate").mockReturnValueOnce(false);
        const response = sut.validate({ name: "any_name" });
        expect(response).toStrictEqual(new errors_1.InvalidParamError("name"));
    });
    test("should call NameValidator with correct Name", async () => {
        const { sut, nameValidatorStub } = makeSut();
        const validateSpy = jest.spyOn(nameValidatorStub, "validate");
        sut.validate({ name: "any_name" });
        expect(validateSpy).toHaveBeenCalledWith("any_name");
    });
    test("should throw if NameValidator throws", async () => {
        const { sut, nameValidatorStub } = makeSut();
        jest.spyOn(nameValidatorStub, "validate").mockImplementationOnce(() => {
            throw new Error();
        });
        expect(sut.validate).toThrow();
    });
});
