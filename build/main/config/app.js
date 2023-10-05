"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("./middlewares");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
(0, middlewares_1.setupMiddlewares)(app);
(0, routes_1.setupRoutes)(app);
exports.default = app;
