import { InvalidParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import type { CheckRefreshToken } from "../../../domain/usecase/check-refresh-token";
import type { CreateAccessToken } from "../../../data/protocols/create-access-token";
import type { Controller, HttpRequest, HttpResponse } from "../../protocols/";
import type { Validation } from "../../helpers/validators/validation";

export class RefreshTokenController implements Controller {
  public constructor(
    private readonly checkRefreshToken: CheckRefreshToken,
    private readonly createAccessToken: CreateAccessToken,
    private readonly validation: Validation
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.header);

      if (error) return badRequest(error);

      const userId = await this.checkRefreshToken.check(
        httpRequest.header.refreshtoken
      );

      if (!userId) {
        return badRequest(new InvalidParamError("refreshtoken"));
      }

      const tokenInformation = this.createAccessToken.create(userId);

      return ok(tokenInformation);
    } catch (err) {
      return serverError();
    }
  }
}
