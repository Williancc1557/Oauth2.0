"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogControllerDecorator = void 0;
const logger_1 = require("../utils/logger");
class LogControllerDecorator {
    constructor(controller) {
        this.controller = controller;
    }
    async handle(httpRequest) {
        logger_1.logger.info("Router executed");
        logger_1.logger.info(`bodyRequest: ${JSON.stringify(httpRequest.body)}`);
        const controller = await this.controller.handle(httpRequest);
        const bodyResponse = `bodyResponse: ${JSON.stringify(controller.body)}`;
        const OK = 200;
        const MULTIPLE_CHOICES = 300;
        const INTERNAL_SERVER_ERROR = 500;
        if (controller.statusCode >= OK &&
            controller.statusCode < MULTIPLE_CHOICES) {
            logger_1.logger.info(bodyResponse);
        }
        else if (controller.statusCode == INTERNAL_SERVER_ERROR) {
            logger_1.logger.fatal(bodyResponse);
        }
        else {
            logger_1.logger.warn(bodyResponse);
        }
        return controller;
    }
}
exports.LogControllerDecorator = LogControllerDecorator;
