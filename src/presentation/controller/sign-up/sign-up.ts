import type { AddAccount } from "../../../domain/usecase/add-account";
import type { GetAccountByEmail } from "../../../domain/usecase/get-account-by-email";
import { AccountAlreadyExistsError } from "../../erros/account-already-exists-error";
import { InvalidParamError } from "../../erros/invalid-param-error";
import { MissingParamError } from "../../erros/missing-param-error";
import {
  badRequest,
  conflict,
  ok,
  serverError,
} from "../../helpers/http-helper";
import type { Controller } from "../../protocols/controller";
import type { CreateAcessToken } from "../../protocols/create-acess-token";
import type { HttpRequest, HttpResponse } from "../../protocols/http";
import type { ValidateEmail } from "../../protocols/validate-email";

export class SignUpController implements Controller {
  public constructor(
    public readonly validateEmail: ValidateEmail,
    public readonly getAccountByEmail: GetAccountByEmail,
    public readonly addAccount: AddAccount,
    public readonly createAcessToken: CreateAcessToken,
  ) { }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParams = ["name", "email", "password"];

      for (const param of requiredParams) {
        if (!httpRequest.body[param]) {
          return badRequest(new MissingParamError(param));
        }
      }

      if (!this.validateEmail.validate(httpRequest.body.email)) {
        return badRequest(new InvalidParamError("email"));
      }

      if (await this.getAccountByEmail.get(httpRequest.body.email)) {
        return conflict(new AccountAlreadyExistsError());
      }

      const account = await this.addAccount.add(httpRequest.body);

      const acessToken = this.createAcessToken.create(account.id);

      return ok(Object.assign(account, { acessToken }));
    } catch (err) {
      return serverError();
    }
  }
}
