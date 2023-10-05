"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInController = void 0;
const errors_1 = require("../../errors");
const http_helper_1 = require("../../helpers/http-helper");
class SignInController {
    constructor(getAccountByEmail, resetRefreshToken, encrypter, validation) {
        this.getAccountByEmail = getAccountByEmail;
        this.resetRefreshToken = resetRefreshToken;
        this.encrypter = encrypter;
        this.validation = validation;
    }
    async handle(httpRequest) {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error)
                return (0, http_helper_1.badRequest)(error);
            const account = await this.getAccountByEmail.get(httpRequest.body.email);
            if (!account) {
                return (0, http_helper_1.badRequest)(new errors_1.UserNotExistsError());
            }
            if (!(await this.encrypter.compare(httpRequest.body.password, account.password))) {
                return (0, http_helper_1.badRequest)(new errors_1.InvalidParamError("password"));
            }
            const newRefreshToken = await this.resetRefreshToken.reset(account.id);
            return (0, http_helper_1.ok)({ refreshToken: newRefreshToken });
        }
        catch (err) {
            return (0, http_helper_1.serverError)();
        }
    }
}
exports.SignInController = SignInController;
