"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verify_access_token_1 = require("./verify-access-token");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock("jsonwebtoken", () => ({
    verify() {
        return {};
    },
}));
const makeSut = () => {
    const sut = new verify_access_token_1.UtilVerifyAccessToken();
    return {
        sut,
    };
};
describe("UtilVerifyAccessToken", () => {
    test("should return true if success", () => {
        const { sut } = makeSut();
        const res = sut.verify("accessToken");
        expect(res).toBe(true);
    });
    test("should return false if jwt throws", async () => {
        const { sut } = makeSut();
        jest.spyOn(jsonwebtoken_1.default, "verify").mockImplementationOnce(() => {
            throw new Error();
        });
        expect(sut.verify("accessToken")).toBe(false);
    });
});
