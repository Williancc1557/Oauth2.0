import { EmailValidation } from "../../../presentation/helpers/validators/email-validation/email-validation";
import { PasswordValidation } from "../../../presentation/helpers/validators/password-validation/password-validation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-fields-validation/required-fields-validation";
import type { Validation } from "../../../presentation/helpers/validators/validation";
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
