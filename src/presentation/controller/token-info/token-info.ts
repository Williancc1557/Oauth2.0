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
import type { VerifyAccessToken } from "../../protocols/verify-access-token";

export class TokenInfoController implements Controller {
  public constructor(
    private readonly requiredParams: RequiredParams,
    private readonly getTokenInfo: GetTokenInfo,
    private readonly isValidRefreshToken: IsValidRefreshToken,
    private readonly verifyAccessToken: VerifyAccessToken
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

      if (!this.verifyAccessToken.verify(httpRequest.body.accessToken)) {
        return badRequest(new InvalidParamError("accessToken"));
      }

      const tokenInfo = this.getTokenInfo.get(httpRequest.body.accessToken);

      if (
        !(await this.isValidRefreshToken.check(
          httpRequest.body.refreshToken,
          tokenInfo.accountId
        ))
      ) {
        return badRequest(new InvalidParamError("refreshToken"));
      }

      return {
        body: tokenInfo,
        statusCode: 200,
      };
    } catch (err) {
      return serverError();
    }
  }
}
