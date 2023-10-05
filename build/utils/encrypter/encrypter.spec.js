"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const encrypter_1 = require("./encrypter");
const bcrypt_1 = __importDefault(require("bcrypt"));
jest.mock("bcrypt", () => ({
    async compare() {
        return true;
    },
    async hash() {
        return "hashed_password";
    },
}));
const makeSut = () => {
    const sut = new encrypter_1.UtilEncrypter(10);
    return {
        sut,
    };
};
describe("Encrypter", () => {
    test("should return a string if success hash", async () => {
        const { sut } = makeSut();
        const res = await sut.hash("valid_value");
        expect(res).toBeTruthy();
    });
    test("should throw if bcrypt.hash throws", async () => {
        const { sut } = makeSut();
        jest.spyOn(bcrypt_1.default, "hash").mockRejectedValueOnce(new Error());
        const res = sut.hash("valid_value");
        await expect(res).rejects.toThrow();
    });
    test("should return true if success compare", async () => {
        const { sut } = makeSut();
        const hashedValue = await sut.hash("valid_value");
        const res = await sut.compare("valid_value", hashedValue);
        expect(res).toBe(true);
    });
    test("should throw if bcrypt.compare throws", async () => {
        const { sut } = makeSut();
        jest.spyOn(bcrypt_1.default, "compare").mockImplementationOnce(() => {
            throw new Error();
        });
        const res = sut.compare("valid_value", "valid_value");
        await expect(res).rejects.toThrow();
    });
});
