import { MissingParamError } from "../../../errors";
import type { Validation } from "../validation";

export class RequiredFieldValidation implements Validation {
  public constructor(private readonly fieldName: string) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
  }
}
