import { MissingParamError } from "../../erros/missing-param-error";
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
    private readonly requiredParams: RequiredParams
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

      return ok(null);
    } catch (err) {
      return serverError();
    }
  }
}
