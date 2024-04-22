import { ok, serverError } from "../helpers/http-helper";
import type { Controller, HttpRequest, HttpResponse } from "../protocols";
import type { VerifyAccessToken } from "../protocols/verify-access-token";

export class VerifyAccessTokenController implements Controller {
  public constructor(
    private readonly utilVerifyAccessToken: VerifyAccessToken
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isValidToken = this.utilVerifyAccessToken.verify(
        httpRequest.header.authorization
      );

      if (!isValidToken) return ok(isValidToken);

      return ok(isValidToken);
    } catch {
      return serverError();
    }
  }
}
