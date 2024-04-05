import { mongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
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

    const controller = await this.controller.handle(httpRequest);

    const bodyResponse = `error: ${JSON.stringify(controller.body)}`;

    const OK = 200;
    const MULTIPLE_CHOICES = 300;
    const INTERNAL_SERVER_ERROR = 500;

    const logsCollection = await mongoHelper.getCollection("logs");

    if (
      controller.statusCode >= OK &&
      controller.statusCode < MULTIPLE_CHOICES
    ) {
      logger.info("Router execute with success", controller.statusCode);
    } else if (controller.statusCode == INTERNAL_SERVER_ERROR) {
      logger.fatal(bodyResponse);
    } else {
      logger.warn(bodyResponse);
    }

    await logsCollection.insertOne({
      createdAt: new Date(),
      statusCode: controller.statusCode,
      origin: httpRequest.header.origin,
      body: controller.body.error,
      userAgent: httpRequest.header["user-agent"],
      userSystemOperation: httpRequest.header["sec-ch-ua-platform"],
      url: httpRequest.header.url,
      method: httpRequest.header.method,
      expiresIn: new Date(),
    });

    const indexExists = await logsCollection.indexExists("expiresIn_1");

    if (!indexExists) {
      await logsCollection.createIndex(
        { expiresIn: 1 },
        { expireAfterSeconds: 604800 }
      );
    }

    return controller;
  }
}
