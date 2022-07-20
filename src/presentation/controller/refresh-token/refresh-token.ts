import { InvalidParamError } from "../../erros/invalid-param-error";
import { MissingParamError } from "../../erros/missing-param-error";
import { badRequest } from "../../helpers/http-helper";
import type { CheckRefreshToken } from "../../protocols/check-refresh-token";
import type { Controller } from "../../protocols/controller";
import type { HttpRequest, HttpResponse } from "../../protocols/http";

export class RefreshTokenController implements Controller {
  public constructor(private readonly checkRefreshToken: CheckRefreshToken) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body?.acessToken) {
      return badRequest(new MissingParamError("acessToken"));
    }

    const email = this.checkRefreshToken.check(httpRequest.body.acessToken);

    if (!email) {
      return badRequest(new InvalidParamError("acessToken"));
    }

    if (email)
      return {
        statusCode: 200,
        body: {
          email,
        },
      };
  }
}
