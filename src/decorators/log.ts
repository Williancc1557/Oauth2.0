import type {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../presentation/protocols";
import { logger } from "../utils/logger";

export class LogControllerDecorator implements Controller {
  public constructor(private readonly controller: Controller) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    logger.info("Router executed");
    logger.info(`bodyRequest: ${JSON.stringify(httpRequest.body)}`);

    const controller = await this.controller.handle(httpRequest);

    const bodyResponse = `bodyResponse: ${JSON.stringify(controller.body)}`;

    const OK = 200;
    const MULTIPLE_CHOICES = 300;
    const INTERNAL_SERVER_ERROR = 500;
    if (
      controller.statusCode >= OK &&
      controller.statusCode < MULTIPLE_CHOICES
    ) {
      logger.info(bodyResponse);
    } else if (controller.statusCode == INTERNAL_SERVER_ERROR) {
      logger.fatal(bodyResponse);
    } else {
      logger.warn(bodyResponse);
    }

    return controller;
  }
}
