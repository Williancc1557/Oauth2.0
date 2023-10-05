"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpController = void 0;
const account_already_exists_error_1 = require("../../errors/account-already-exists-error");
const http_helper_1 = require("../../helpers/http-helper");
class SignUpController {
    constructor(getAccountByEmail, addAccount, validation) {
        this.getAccountByEmail = getAccountByEmail;
        this.addAccount = addAccount;
        this.validation = validation;
    }
    async handle(httpRequest) {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error)
                return (0, http_helper_1.badRequest)(error);
            if (await this.getAccountByEmail.get(httpRequest.body.email)) {
                return (0, http_helper_1.conflict)(new account_already_exists_error_1.AccountAlreadyExistsError());
            }
            const account = await this.addAccount.add(httpRequest.body);
            return (0, http_helper_1.ok)({
                expiresIn: account.expiresIn,
                accessToken: account.accessToken,
                refreshToken: account.refreshToken,
            });
        }
        catch (err) {
            return (0, http_helper_1.serverError)();
        }
    }
}
exports.SignUpController = SignUpController;
