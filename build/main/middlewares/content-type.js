"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentType = void 0;
const contentType = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
};
exports.contentType = contentType;
