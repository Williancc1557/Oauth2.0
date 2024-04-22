import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";
import { PasswordValidation } from "../../../presentation/helpers/validators/password-validation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation";
import type { Validation } from "../../../presentation/protocols/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import { UtilPasswordValidator, UtilValidateEmail } from "../../../utils";

export const makeSignInValidation = () => {
  const validations: Array<Validation> = [];

  for (const field of ["password", "email"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation("email", new UtilValidateEmail()));
  validations.push(
    new PasswordValidation("password", new UtilPasswordValidator())
  );

  return new ValidationComposite(validations);
};
