"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_route_adapter_1 = require("../../../adapters/express-route-adapter");
const sign_in_1 = require("../../../factories/sign-in/sign-in");
exports.default = (router) => {
    router.post("/auth/sign-in", (0, express_route_adapter_1.adaptRoute)((0, sign_in_1.makeSignInController)()));
};
