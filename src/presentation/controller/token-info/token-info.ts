import { MissingParamError } from "../../errors";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import type { Validation } from "../../helpers/validations/validation";
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  RequiredParams,
} from "../../protocols";
import type { GetTokenInfo } from "../../protocols/get-token-info";
import type { VerifyAccessToken } from "../../protocols/verify-access-token";

export class TokenInfoController implements Controller {
  public constructor(
    private readonly requiredParams: RequiredParams,
    private readonly getTokenInfo: GetTokenInfo,
    private readonly verifyAccessToken: VerifyAccessToken,
    private readonly validation: Validation
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.header);
      const requiredParam = this.requiredParams.check(
        ["accesstoken"],
        httpRequest.header
      );

      const { accesstoken } = httpRequest.header;

      if (requiredParam) {
        return badRequest(new MissingParamError(requiredParam));
      }

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
