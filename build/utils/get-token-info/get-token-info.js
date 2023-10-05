"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilGetTokenInfo = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UtilGetTokenInfo {
    get(token) {
        const jwtInfo = jsonwebtoken_1.default.decode(token);
        return jwtInfo;
    }
}
exports.UtilGetTokenInfo = UtilGetTokenInfo;
