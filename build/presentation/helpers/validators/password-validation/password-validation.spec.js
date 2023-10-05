"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../errors");
const password_validation_1 = require("./password-validation");
const makePasswordValidator = () => {
    class PasswordValidatorStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(email) {
            return true;
        }
    }
    return new PasswordValidatorStub();
};
const makeSut = () => {
    const passwordValidatorStub = makePasswordValidator();
    const sut = new password_validation_1.PasswordValidation("password", passwordValidatorStub);
    return {
        sut,
        passwordValidatorStub,
    };
};
describe("Password Validation", () => {
    test("should return error if password is not valid", async () => {
        const { sut, passwordValidatorStub } = makeSut();
        jest.spyOn(passwordValidatorStub, "validate").mockReturnValueOnce(false);
        const response = sut.validate({ password: "any_password" });
        expect(response).toStrictEqual(new errors_1.InvalidParamError("password"));
    });
    test("should call passwordValidator with correct password", async () => {
        const { sut, passwordValidatorStub } = makeSut();
        const validateSpy = jest.spyOn(passwordValidatorStub, "validate");
        sut.validate({ password: "any_password" });
        expect(validateSpy).toHaveBeenCalledWith("any_password");
    });
    test("should throw if passwordValidator throws", async () => {
        const { sut, passwordValidatorStub } = makeSut();
        jest.spyOn(passwordValidatorStub, "validate").mockImplementationOnce(() => {
            throw new Error();
        });
        expect(sut.validate).toThrow();
    });
});
