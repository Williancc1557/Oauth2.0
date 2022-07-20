import type { Controller } from "src/presentation/protocols/controller";
import type {
  HttpRequest,
  HttpResponse,
} from "src/presentation/protocols/http";

export class RefreshTokenController implements Controller {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 400,
      body: null,
    };
  }
}
