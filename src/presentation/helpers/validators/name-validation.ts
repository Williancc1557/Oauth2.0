import { InvalidParamError } from "../../errors";
import type { NameValidator } from "../../protocols/name-validator";
import type { Validation } from "../../protocols/validation";

export class NameValidation implements Validation {
  public constructor(
    private readonly fieldName: string,
    private readonly nameValidator: NameValidator
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(input: any): Error {
    const name = input[this.fieldName];
    const isValidName = this.nameValidator.validate(name);

    if (!isValidName) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
