"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_route_adapter_1 = require("../../../adapters/express-route-adapter");
const sign_up_1 = require("../../../factories/sign-up/sign-up");
exports.default = (router) => {
    router.post("/auth/sign-up", (0, express_route_adapter_1.adaptRoute)((0, sign_up_1.makeSignUpController)()));
};
