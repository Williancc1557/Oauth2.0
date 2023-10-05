"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTokenInfoController = void 0;
const token_info_1 = require("../../../presentation/controller/token-info/token-info");
const get_token_info_1 = require("../../../utils/get-token-info/get-token-info");
const verify_access_token_1 = require("../../../utils/verify-access-token/verify-access-token");
const token_info_validation_1 = require("./token-info-validation");
const makeTokenInfoController = () => {
    const getTokenInfo = new get_token_info_1.UtilGetTokenInfo();
    const verifyTokenAccess = new verify_access_token_1.UtilVerifyAccessToken();
    const controller = new token_info_1.TokenInfoController(getTokenInfo, verifyTokenAccess, (0, token_info_validation_1.makeTokenInfoValidation)());
    return controller;
};
exports.makeTokenInfoController = makeTokenInfoController;
