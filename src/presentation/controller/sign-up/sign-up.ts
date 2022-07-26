import { MissingParamError } from "../../erros/missing-param-error";
import { badRequest, ok } from "../../helpers/http-helper";
import type { Controller } from "../../protocols/controller";
import type { HttpRequest, HttpResponse } from "../../protocols/http";

export class SignUpController implements Controller {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError("name"));
    }

    return ok(null);
  }
}
