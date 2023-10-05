"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
class RefreshTokenController {
    constructor(checkRefreshToken, createAccessToken, validation) {
        this.checkRefreshToken = checkRefreshToken;
        this.createAccessToken = createAccessToken;
        this.validation = validation;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(httpRequest) {
        try {
            const error = this.validation.validate(httpRequest.header);
            if (error)
                return (0, http_helper_1.badRequest)(error);
            const userId = await this.checkRefreshToken.check(httpRequest.header.refreshtoken);
            if (!userId) {
                return (0, http_helper_1.unauthorized)();
            }
            const tokenInformation = this.createAccessToken.create(userId);
            return (0, http_helper_1.ok)(tokenInformation);
        }
        catch (err) {
            return (0, http_helper_1.serverError)();
        }
    }
}
exports.RefreshTokenController = RefreshTokenController;
