"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.default = {
    mongoUrl: process.env.MONGO_URL || "mongodb://0.0.0.0:27017/auth2",
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    port: process.env.PORT || 8080,
    secretAccessTokenJwt: process.env.SECRET_JWT || "secret_jwt",
    state: process.env.STATE || "development",
};
