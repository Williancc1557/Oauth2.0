"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilRequiredParams = void 0;
class UtilRequiredParams {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    check(requiredParams, body) {
        for (const param of requiredParams) {
            if (!body[param]) {
                return param;
            }
        }
    }
}
exports.UtilRequiredParams = UtilRequiredParams;
