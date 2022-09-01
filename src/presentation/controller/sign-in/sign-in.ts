import type { Encrypter } from "../../../data/protocols/encrypter";
import type { GetAccountByEmail } from "../../../domain/usecase/get-account-by-email";
import type { ResetRefreshToken } from "../../../domain/usecase/reset-refresh-token";
import { UserNotExistsError, InvalidParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import type { Controller, HttpRequest, HttpResponse } from "../../protocols/";
import type { Validation } from "../../protocols/validation";

export class SignInController implements Controller {
  public constructor(
    private readonly getAccountByEmail: GetAccountByEmail,
    private readonly resetRefreshToken: ResetRefreshToken,
    private readonly encrypter: Encrypter,
    private readonly validation: Validation
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) return badRequest(error);

      const account = await this.getAccountByEmail.get(httpRequest.body.email);

      if (!account) {
        return badRequest(new UserNotExistsError());
      }

      if (
        !(await this.encrypter.compare(
          httpRequest.body.password,
          account.password
        ))
      ) {
        return badRequest(new InvalidParamError("password"));
      }
      const newRefreshToken = await this.resetRefreshToken.reset(account.id);

      return ok({ refreshToken: newRefreshToken });
    } catch (err) {
      return serverError();
    }
  }
}
