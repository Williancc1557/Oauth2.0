"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRefreshTokenController = void 0;
const check_refresh_token_1 = require("../../../data/usecase/check-refresh-token/check-refresh-token");
const log_1 = require("../../../decorators/log");
const get_refresh_token_1 = require("../../../infra/db/mongodb/refresh-token-repository/get-refresh-token");
const refresh_token_1 = require("../../../presentation/controller/refresh-token/refresh-token");
const utils_1 = require("../../../utils/");
const refresh_token_validation_1 = require("./refresh-token-validation");
const makeRefreshTokenController = () => {
    const getRefreshTokenRepository = new get_refresh_token_1.GetRefreshTokenMongoRepository();
    const checkRefreshToken = new check_refresh_token_1.DbCheckRefreshToken(getRefreshTokenRepository);
    const createAccessToken = new utils_1.UtilCreateAccessToken();
    const refreshTokenController = new refresh_token_1.RefreshTokenController(checkRefreshToken, createAccessToken, (0, refresh_token_validation_1.makeRefreshTokenValidation)());
    return new log_1.LogControllerDecorator(refreshTokenController);
};
exports.makeRefreshTokenController = makeRefreshTokenController;
