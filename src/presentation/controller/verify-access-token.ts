import { badRequest, ok, serverError } from "../helpers/http-helper";
import type { Controller, HttpRequest, HttpResponse } from "../protocols";
import type { Validation } from "../protocols/validation";
import type { VerifyAccessToken } from "../protocols/verify-access-token";

export class VerifyAccessTokenController implements Controller {
  public constructor(
    private readonly utilVerifyAccessToken: VerifyAccessToken,
    private readonly validation: Validation
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.header);
      if (error) return badRequest(error);

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
