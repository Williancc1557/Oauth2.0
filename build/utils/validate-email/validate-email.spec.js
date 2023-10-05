"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate_email_1 = require("./validate-email");
const validator_1 = __importDefault(require("validator"));
jest.mock("validator", () => ({
    isEmail() {
        return true;
    },
}));
const makeSut = () => {
    return new validate_email_1.UtilValidateEmail();
};
describe("EmailValidator Adapter", () => {
    test("should return false if validator returns false", () => {
        const sut = makeSut();
        jest.spyOn(validator_1.default, "isEmail").mockReturnValueOnce(false);
        const validate = sut.validate("invalid_email@email.com");
        expect(validate).toBe(false);
    });
    test("should return true if validator returns true", () => {
        const sut = makeSut();
        const validate = sut.validate("valid_email@email.com");
        expect(validate).toBe(true);
    });
    test("should call validator with correct email", () => {
        const sut = makeSut();
        const isEmailSpy = jest.spyOn(validator_1.default, "isEmail");
        sut.validate("any_email@email.com");
        expect(isEmailSpy).toHaveBeenCalledWith("any_email@email.com");
    });
});
