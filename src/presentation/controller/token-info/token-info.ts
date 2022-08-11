import type { IsValidRefreshToken } from "../../../domain/usecase/is-valid-refresh-token";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  RequiredParams,
} from "../../protocols";
import type { GetTokenInfo } from "../../protocols/get-token-info";

export class TokenInfoController implements Controller {
  public constructor(
    private readonly requiredParams: RequiredParams,
    private readonly getTokenInfo: GetTokenInfo,
    private readonly isValidRefreshToken: IsValidRefreshToken
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParam = this.requiredParams.check(
        ["refreshToken", "accessToken"],
        httpRequest.body
      );

      if (requiredParam) {
        return badRequest(new MissingParamError(requiredParam));
      }

      if (
        !(await this.isValidRefreshToken.check(httpRequest.body.refreshToken))
      ) {
        return badRequest(new InvalidParamError("refreshToken"));
      }

      const tokenInfo = this.getTokenInfo.get(httpRequest.body.accessToken);

      return {
        body: tokenInfo,
        statusCode: 200,
      };
    } catch (err) {
      return serverError();
    }
  }
}
