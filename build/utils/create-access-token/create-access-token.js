"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilCreateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../main/config/env"));
class UtilCreateAccessToken {
    create(userId) {
        const expiresIn = 300;
        const accessToken = jsonwebtoken_1.default.sign({
            accountId: userId,
            sub: "client",
        }, env_1.default.secretAccessTokenJwt, {
            expiresIn,
        });
        return {
            expiresIn,
            accessToken,
        };
    }
}
exports.UtilCreateAccessToken = UtilCreateAccessToken;
