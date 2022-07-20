import { InvalidParamError } from "../../erros/invalid-param-error";
import { MissingParamError } from "../../erros/missing-param-error";
import { badRequest, serverError } from "../../helpers/http-helper";
import type { CheckRefreshToken } from "../../protocols/check-refresh-token";
import type { Controller } from "../../protocols/controller";
import type { CreateAcessToken } from "../../protocols/create-acess-token";
import type { HttpRequest, HttpResponse } from "../../protocols/http";

export class RefreshTokenController implements Controller {
  public constructor(
    private readonly checkRefreshToken: CheckRefreshToken,
    private readonly createAcessToken: CreateAcessToken
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.body?.refreshToken) {
        return badRequest(new MissingParamError("refreshToken"));
      }

      const userId = await this.checkRefreshToken.check(
        httpRequest.body.refreshToken
      );

      if (!userId) {
        return badRequest(new InvalidParamError("refreshToken"));
      }

      const acessToken = this.createAcessToken.create(userId);

      return {
        statusCode: 200,
        body: {
          acessToken,
        },
      };
    } catch (err) {
      return serverError();
    }
  }
}
