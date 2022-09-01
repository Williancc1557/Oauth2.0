import type { AddAccount } from "../../../domain/usecase/add-account";
import type { GetAccountByEmail } from "../../../domain/usecase/get-account-by-email";
import { AccountAlreadyExistsError } from "../../errors/account-already-exists-error";
import {
  badRequest,
  conflict,
  ok,
  serverError,
} from "../../helpers/http-helper";
import type { Controller, HttpRequest, HttpResponse } from "../../protocols/";
import type { Validation } from "../../protocols/validation";

export class SignUpController implements Controller {
  public constructor(
    private readonly getAccountByEmail: GetAccountByEmail,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) return badRequest(error);

      if (await this.getAccountByEmail.get(httpRequest.body.email)) {
        return conflict(new AccountAlreadyExistsError());
      }

      const account = await this.addAccount.add(httpRequest.body);

      return ok({
        expiresIn: account.expiresIn,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
      });
    } catch (err) {
      return serverError();
    }
  }
}
