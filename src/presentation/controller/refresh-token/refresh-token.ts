import { InvalidParamError } from "../../errors/invalid-param-error";
import { MissingParamError } from "../../errors/missing-param-error";
import { badRequest, serverError } from "../../helpers/http-helper";
import type { CheckRefreshToken } from "../../../domain/usecase/check-refresh-token";
import type { CreateAcessToken } from "../../../data/protocols/create-acess-token";
import type { Controller, HttpRequest, HttpResponse } from "../../protocols/";

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
