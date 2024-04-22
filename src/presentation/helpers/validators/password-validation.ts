import { InvalidParamError } from "../../errors";
import type { PasswordValidator } from "../../protocols/password-validator";
import type { Validation } from "../../protocols/validation";

export class PasswordValidation implements Validation {
  public constructor(
    private readonly fieldPassword: string,
    private readonly passwordValidator: PasswordValidator
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(input: any): Error {
    const password = input[this.fieldPassword];
    const isValidPassword = this.passwordValidator.validate(password);

    if (!isValidPassword) {
      return new InvalidParamError(this.fieldPassword);
    }
  }
}
