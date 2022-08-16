import { MissingParamError, InvalidParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import type { CheckRefreshToken } from "../../../domain/usecase/check-refresh-token";
import type { CreateAccessToken } from "../../../data/protocols/create-access-token";
import type { Controller, HttpRequest, HttpResponse } from "../../protocols/";

export class RefreshTokenController implements Controller {
  public constructor(
    private readonly checkRefreshToken: CheckRefreshToken,
    private readonly createAccessToken: CreateAccessToken
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.header?.refreshtoken) {
        return badRequest(new MissingParamError("refreshtoken"));
      }

      const userId = await this.checkRefreshToken.check(
        httpRequest.header.refreshtoken
      );

      if (!userId) {
        return badRequest(new InvalidParamError("refreshtoken"));
      }

      const tokenInformation = this.createAccessToken.create(userId);

      return {
        statusCode: 200,
        body: tokenInformation,
      };
    } catch (err) {
      return serverError();
    }
  }
}
