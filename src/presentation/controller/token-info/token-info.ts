import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
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
    private readonly verifyAccessToken: VerifyAccessToken
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParam = this.requiredParams.check(
        ["accesstoken"],
        httpRequest.header
      );

      if (requiredParam) {
        return badRequest(new MissingParamError(requiredParam));
      }

      if (!this.verifyAccessToken.verify(httpRequest.header.accesstoken)) {
        return badRequest(new InvalidParamError("accessToken"));
      }

      const tokenInfo = this.getTokenInfo.get(httpRequest.header.accesstoken);

      return ok(tokenInfo);
    } catch (err) {
      return serverError();
    }
  }
}
