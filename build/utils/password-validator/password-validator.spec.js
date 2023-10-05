"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const password_validator_1 = require("./password-validator");
const makeSut = () => {
    const sut = new password_validator_1.UtilPasswordValidator();
    return {
        sut,
    };
};
describe("PasswordValidator Util", () => {
    test("should return true if success", () => {
        const { sut } = makeSut();
        const res = sut.validate("valid_password");
        expect(res).toBe(true);
    });
    test("should return false if password is not valid", () => {
        const { sut } = makeSut();
        const res = sut.validate("a");
        expect(res).toBe(false);
    });
});
