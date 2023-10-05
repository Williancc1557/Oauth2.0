"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const express_1 = require("express");
const fast_glob_1 = __importDefault(require("fast-glob"));
const logger_1 = require("../../utils/logger");
const env_1 = __importDefault(require("./env"));
const setupRoutes = (app) => {
    const router = (0, express_1.Router)();
    app.use(router);
    const fileRule = env_1.default.state === "production"
        ? "**/main/routes/**/**-router/**-router.js"
        : "**/src/main/routes/**/**-router/**-router.ts";
    fast_glob_1.default.sync([fileRule]).map(async (file) => {
        const fileList = file.split("/");
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const index = fileList.length - 1;
        logger_1.logger.info(`Loading the file router ${fileList[index]} ...`);
        (await Promise.resolve(`${`../../../${file}`}`).then(s => __importStar(require(s)))).default(router);
    });
};
exports.setupRoutes = setupRoutes;
