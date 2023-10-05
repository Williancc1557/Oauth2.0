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
const mongo_helper_1 = require("../infra/db/mongodb/helpers/mongo-helper");
const logger_1 = require("../utils/logger");
const env_1 = __importDefault(require("./config/env"));
const bootstrap = async () => {
    let mongoConectionCheck = true;
    await mongo_helper_1.mongoHelper
        .connect(env_1.default.mongoUrl)
        .then(() => logger_1.logger.info("mongoDB started"))
        .catch((err) => {
        logger_1.logger.error(err);
        mongoConectionCheck = false;
    });
    if (!mongoConectionCheck)
        return logger_1.logger.fatal("Error in Mongodb connection");
    const app = (await Promise.resolve().then(() => __importStar(require("./config/app")))).default;
    app.listen(env_1.default.port, () => logger_1.logger.info(`Server started with http://localhost:${env_1.default.port}`));
};
bootstrap().then(() => {
    logger_1.logger.info("API made by (Willian Cavalcanti Coelho)");
});
