"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_route_adapter_1 = require("../../../adapters/express-route-adapter");
const refresh_token_1 = require("../../../factories/refresh-token/refresh-token");
exports.default = (router) => {
    router.get("/auth/refresh-token", (0, express_route_adapter_1.adaptRoute)((0, refresh_token_1.makeRefreshTokenController)()));
};
