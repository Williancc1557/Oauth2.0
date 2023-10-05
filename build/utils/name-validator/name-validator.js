"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilNameValidator = void 0;
class UtilNameValidator {
    validate(name) {
        const MIN_LENGTH = 6;
        const MAX_LENGTH = 30;
        if (name.length < MIN_LENGTH || name.length > MAX_LENGTH) {
            return false;
        }
        return true;
    }
}
exports.UtilNameValidator = UtilNameValidator;
