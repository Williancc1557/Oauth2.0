import { InvalidParamError } from "../../erros/invalid-param-error";
import { MissingParamError } from "../../erros/missing-param-error";
import { badRequest, ok } from "../../helpers/http-helper";
import type { Controller } from "../../protocols/controller";
import type { HttpRequest, HttpResponse } from "../../protocols/http";
import type { ValidateEmail } from "../../protocols/validate-email";

export class SignUpController implements Controller {
  public constructor(public readonly validateEmail: ValidateEmail) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError("name"));
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError("email"));
    }

    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError("password"));
    }

    if (!this.validateEmail.validate(httpRequest.body.email)) {
      return badRequest(new InvalidParamError("email"));
    }

    return ok(null);
  }
}
