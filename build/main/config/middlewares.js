"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMiddlewares = void 0;
const body_parse_1 = require("../middlewares/body-parse");
const content_type_1 = require("../middlewares/content-type");
const cors_1 = require("../middlewares/cors");
const setupMiddlewares = (app) => {
    app.use(body_parse_1.bodyParser);
    app.use(content_type_1.contentType);
    app.use(cors_1.cors);
};
exports.setupMiddlewares = setupMiddlewares;
