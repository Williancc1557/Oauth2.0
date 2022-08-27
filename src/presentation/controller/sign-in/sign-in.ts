import type { Encrypter } from "../../../data/protocols/encrypter";
import type { GetAccountByEmail } from "../../../domain/usecase/get-account-by-email";
import type { ResetRefreshToken } from "../../../domain/usecase/reset-refresh-token";
import {
  UserNotExistsError,
  InvalidParamError,
  MissingParamError,
} from "../../errors";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import type { PasswordValidator } from "../../protocols/password-validator";
import type { ValidateEmail } from "../../protocols/validate-email";
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  RequiredParams,
} from "../../protocols/";

export class SignInController implements Controller {
  public constructor(
    private readonly validateEmail: ValidateEmail,
    private readonly passwordValidator: PasswordValidator,
    private readonly requiredParams: RequiredParams,
    private readonly getAccountByEmail: GetAccountByEmail,
    private readonly resetRefreshToken: ResetRefreshToken,
    private readonly encrypter: Encrypter
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParam = this.requiredParams.check(
        ["email", "password"],
        httpRequest.body
      );

      if (requiredParam) {
        return badRequest(new MissingParamError(requiredParam));
      }

      if (!this.validateEmail.validate(httpRequest.body.email)) {
        return badRequest(new InvalidParamError("email"));
      }

      if (!this.passwordValidator.validate(httpRequest.body.password)) {
        return unauthorized();
      }

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
