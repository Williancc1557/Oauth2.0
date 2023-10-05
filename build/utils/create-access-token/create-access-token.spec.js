"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_access_token_1 = require("./create-access-token");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe("CreateAccessToken", () => {
    test("should return accessToken if success", () => {
        const sut = new create_access_token_1.UtilCreateAccessToken();
        jest.spyOn(jsonwebtoken_1.default, "sign");
        const res = sut.create("user_id");
        expect(res).toBeTruthy();
    });
});
