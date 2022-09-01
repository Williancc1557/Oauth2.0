import type { Validation } from "../../protocols/validation";

export class ValidationComposite implements Validation {
  public constructor(private readonly validations: Array<Validation>) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validate(input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input);
      if (error) return error;
    }
  }
}
