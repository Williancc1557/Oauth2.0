"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorized = exports.conflict = exports.ok = exports.serverError = exports.badRequest = void 0;
const server_error_1 = require("../errors/server-error");
const errors_1 = require("../errors");
const badRequest = (error) => ({
    statusCode: 400,
    body: { error: error.message },
});
exports.badRequest = badRequest;
const serverError = () => ({
    statusCode: 500,
    body: { error: new server_error_1.ServerError().message },
});
exports.serverError = serverError;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ok = (data) => ({
    statusCode: 200,
    body: data,
});
exports.ok = ok;
const conflict = (error) => ({
    statusCode: 409,
    body: { error: error.message },
});
exports.conflict = conflict;
const unauthorized = () => ({
    body: { error: new errors_1.UnauthorizedError().message },
    statusCode: 401,
});
exports.unauthorized = unauthorized;
