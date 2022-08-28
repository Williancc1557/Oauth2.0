import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import type { Validation } from "../../helpers/validatiors/validation";
import type { Controller, HttpRequest, HttpResponse } from "../../protocols";
import type { GetTokenInfo } from "../../protocols/get-token-info";
import type { VerifyAccessToken } from "../../protocols/verify-access-token";

export class TokenInfoController implements Controller {
  public constructor(
    private readonly getTokenInfo: GetTokenInfo,
    private readonly verifyAccessToken: VerifyAccessToken,
    private readonly validation: Validation
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.header);
      if (error) return badRequest(error);

      const { accesstoken } = httpRequest.header;
      if (!this.verifyAccessToken.verify(accesstoken)) {
        return unauthorized();
      }

      const tokenInfo = this.getTokenInfo.get(accesstoken);

      return ok(tokenInfo);
    } catch (err) {
      return serverError();
    }
  }
}
