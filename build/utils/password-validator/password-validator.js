"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilPasswordValidator = void 0;
class UtilPasswordValidator {
    validate(password) {
        const MIN_LENGTH = 6;
        const MAX_LENGTH = 30;
        return !(password.length >= MAX_LENGTH || password.length <= MIN_LENGTH);
    }
}
exports.UtilPasswordValidator = UtilPasswordValidator;
