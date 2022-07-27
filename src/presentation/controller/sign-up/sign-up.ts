import { InvalidParamError } from "../../erros/invalid-param-error";
import { MissingParamError } from "../../erros/missing-param-error";
import { badRequest, ok } from "../../helpers/http-helper";
import type { Controller } from "../../protocols/controller";
import type { HttpRequest, HttpResponse } from "../../protocols/http";
import type { ValidateEmail } from "../../protocols/validate-email";

export class SignUpController implements Controller {
  public constructor(public readonly validateEmail: ValidateEmail) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredParams = ["name", "email", "password"];

    for (const param of requiredParams) {
      if (!httpRequest.body[param]) {
        return badRequest(new MissingParamError(param));
      }
    }

    if (!this.validateEmail.validate(httpRequest.body.email)) {
      return badRequest(new InvalidParamError("email"));
    }

    return ok(null);
  }
}
