"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../errors");
const email_validation_1 = require("./email-validation");
const makeEmailValidator = () => {
    class EmailValidatorStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(email) {
            return true;
        }
    }
    return new EmailValidatorStub();
};
const makeSut = () => {
    const emailValidatorStub = makeEmailValidator();
    const sut = new email_validation_1.EmailValidation("email", emailValidatorStub);
    return {
        sut,
        emailValidatorStub,
    };
};
describe("Email Validation", () => {
    test("should return error if email is not valid", async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, "validate").mockReturnValueOnce(false);
        const response = sut.validate({ email: "any_email@mail.com" });
        expect(response).toStrictEqual(new errors_1.InvalidParamError("email"));
    });
    test("should call EmailValidator with correct email", async () => {
        const { sut, emailValidatorStub } = makeSut();
        const validateSpy = jest.spyOn(emailValidatorStub, "validate");
        sut.validate({ email: "any_email@mail.com" });
        expect(validateSpy).toHaveBeenCalledWith("any_email@mail.com");
    });
    test("should return 500 if EmailValidator throws", async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, "validate").mockImplementationOnce(() => {
            throw new Error();
        });
        expect(sut.validate).toThrow();
    });
});
