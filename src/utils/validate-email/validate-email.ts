import type { ValidateEmail } from "../../presentation/protocols/validate-email";
import validator from "validator";

export class UtilValidateEmail implements ValidateEmail {
  public validate(email: string): boolean {
    return validator.isEmail(email);
  }
}
