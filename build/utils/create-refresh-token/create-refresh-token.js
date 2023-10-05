"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilCreateRefreshToken = void 0;
const uid_1 = require("uid");
class UtilCreateRefreshToken {
    create() {
        const LENGTH = 25;
        return (0, uid_1.uid)(LENGTH);
    }
}
exports.UtilCreateRefreshToken = UtilCreateRefreshToken;
