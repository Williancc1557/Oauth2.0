"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const name_validator_1 = require("./name-validator");
const makeSut = () => {
    const sut = new name_validator_1.UtilNameValidator();
    return {
        sut,
    };
};
describe("NameValidator Util", () => {
    test("should return true if success", () => {
        const { sut } = makeSut();
        const res = sut.validate("valid_name");
        expect(res).toBe(true);
    });
    test("should return false if email is not valid", () => {
        const { sut } = makeSut();
        const res = sut.validate("a");
        expect(res).toBe(false);
    });
});
