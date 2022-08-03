import type { GetAccountByEmail } from "../../../domain/usecase/get-account-by-email";
import { InvalidParamError } from "../../erros/invalid-param-error";
import { MissingParamError } from "../../erros/missing-param-error";
import { UserNotExistsError } from "../../erros/user-not-exists";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import type { Controller } from "../../protocols/controller";
import type { HttpRequest, HttpResponse } from "../../protocols/http";
import type { PasswordValidator } from "../../protocols/password-validator";
import type { RequiredParams } from "../../protocols/required-params";
import type { ValidateEmail } from "../../protocols/validate-email";

export class SignInController implements Controller {
  public constructor(
    private readonly validateEmail: ValidateEmail,
    private readonly passwordValidator: PasswordValidator,
    private readonly requiredParams: RequiredParams,
    private readonly getAccountByEmail: GetAccountByEmail
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
        return badRequest(new InvalidParamError("password"));
      }

      const account = await this.getAccountByEmail.get(httpRequest.body.email);

      if (!account) {
        return badRequest(new UserNotExistsError());
      }

      return ok(null);
    } catch (err) {
      return serverError();
    }
  }
}
