"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_refresh_token_1 = require("./create-refresh-token");
describe("CreateRefreshToken", () => {
    test("should return refreshToken if success", () => {
        const sut = new create_refresh_token_1.UtilCreateRefreshToken();
        const res = sut.create();
        expect(res).toBeTruthy();
    });
});
