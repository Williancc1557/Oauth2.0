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
import type { NameValidator } from "../../protocols/name-validator";
import type { PasswordValidator } from "../../protocols/password-validator";
import type { RequiredParams } from "../../protocols/required-params";
import type { ValidateEmail } from "../../protocols/validate-email";

export class SignUpController implements Controller {
  public constructor(
    private readonly validateEmail: ValidateEmail,
    private readonly getAccountByEmail: GetAccountByEmail,
    private readonly addAccount: AddAccount,
    private readonly createAcessToken: CreateAcessToken,
    private readonly nameValidator: NameValidator,
    private readonly passwordValidator: PasswordValidator,
    private readonly requiredParams: RequiredParams
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParam = this.requiredParams.check(
        ["name", "email", "password"],
        httpRequest.body
      );

      if (requiredParam) {
        return badRequest(new MissingParamError(requiredParam));
      }
      if (!this.validateEmail.validate(httpRequest.body.email)) {
        return badRequest(new InvalidParamError("email"));
      } else if (!this.nameValidator.validate(httpRequest.body.name)) {
        return badRequest(new InvalidParamError("name"));
      } else if (!this.passwordValidator.validate(httpRequest.body.password)) {
        return badRequest(new InvalidParamError("password"));
      }

      if (await this.getAccountByEmail.get(httpRequest.body.email)) {
        return conflict(new AccountAlreadyExistsError());
      }

      const account = await this.addAccount.add(httpRequest.body);

      const acessToken = this.createAcessToken.create(account.id);

      return ok({
        acessToken,
        refreshToken: account.refreshToken,
      });
    } catch (err) {
      return serverError();
    }
  }
}
