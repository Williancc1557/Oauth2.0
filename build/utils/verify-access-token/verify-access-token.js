"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilVerifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../main/config/env"));
class UtilVerifyAccessToken {
    verify(accessToken) {
        try {
            jsonwebtoken_1.default.verify(accessToken, env_1.default.secretAccessTokenJwt);
            return true;
        }
        catch (err) {
            return false;
        }
    }
}
exports.UtilVerifyAccessToken = UtilVerifyAccessToken;
