"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInfoController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
class TokenInfoController {
    constructor(getTokenInfo, verifyAccessToken, validation) {
        this.getTokenInfo = getTokenInfo;
        this.verifyAccessToken = verifyAccessToken;
        this.validation = validation;
    }
    async handle(httpRequest) {
        try {
            const error = this.validation.validate(httpRequest.header);
            if (error)
                return (0, http_helper_1.badRequest)(error);
            const { accesstoken } = httpRequest.header;
            if (!this.verifyAccessToken.verify(accesstoken)) {
                return (0, http_helper_1.unauthorized)();
            }
            const tokenInfo = this.getTokenInfo.get(accesstoken);
            return (0, http_helper_1.ok)(tokenInfo);
        }
        catch (err) {
            return (0, http_helper_1.serverError)();
        }
    }
}
exports.TokenInfoController = TokenInfoController;
