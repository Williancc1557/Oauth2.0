"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_access_token_1 = require("../create-access-token/create-access-token");
const get_token_info_1 = require("./get-token-info");
const { accessToken } = new create_access_token_1.UtilCreateAccessToken().create("valid_id");
describe("UtilGetTokenInfo", () => {
    test("should return valid values if success", () => {
        const sut = new get_token_info_1.UtilGetTokenInfo();
        const res = sut.get(accessToken);
        expect(res).toStrictEqual(expect.objectContaining({
            accountId: "valid_id",
            sub: "client",
        }));
        expect(res.exp).toBeTruthy();
        expect(res.iat).toBeTruthy();
    });
});
