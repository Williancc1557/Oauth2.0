import { InvalidParamError } from "../../errors";
import type { ValidateEmail } from "../../protocols/validate-email";
import type { Validation } from "./validation";

export class EmailValidation implements Validation {
  public constructor(
    private readonly fieldName: string,
    private readonly emailValidator: ValidateEmail
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(input: any): Error {
    const email = input[this.fieldName];
    const isValidEmail = this.emailValidator.validate(email);

    if (!isValidEmail) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
