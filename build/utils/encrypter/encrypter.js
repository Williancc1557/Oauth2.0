"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilEncrypter = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class UtilEncrypter {
    constructor(salts) {
        this.salts = salts;
    }
    async hash(value) {
        return bcrypt_1.default.hash(value, this.salts);
    }
    async compare(value, hashedValue) {
        return bcrypt_1.default.compare(value, hashedValue);
    }
}
exports.UtilEncrypter = UtilEncrypter;
