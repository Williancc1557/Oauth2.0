import type { PasswordValidator } from "../presentation/protocols/password-validator";

export class UtilPasswordValidator implements PasswordValidator {
  public validate(password: string): boolean {
    const MIN_LENGTH = 6;
    const MAX_LENGTH = 30;

    return !(password.length >= MAX_LENGTH || password.length <= MIN_LENGTH);
  }
}
