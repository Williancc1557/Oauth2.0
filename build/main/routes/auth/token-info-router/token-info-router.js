"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_route_adapter_1 = require("../../../adapters/express-route-adapter");
const token_info_1 = require("../../../factories/token-info/token-info");
exports.default = (router) => {
    router.get("/auth/token-info", (0, express_route_adapter_1.adaptRoute)((0, token_info_1.makeTokenInfoController)()));
};
