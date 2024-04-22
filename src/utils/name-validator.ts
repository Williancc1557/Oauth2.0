import type { NameValidator } from "../presentation/protocols/name-validator";

export class UtilNameValidator implements NameValidator {
  public validate(name: string): boolean {
    const MIN_LENGTH = 6;
    const MAX_LENGTH = 30;

    if (name.length < MIN_LENGTH || name.length > MAX_LENGTH) {
      return false;
    }

    return true;
  }
}
