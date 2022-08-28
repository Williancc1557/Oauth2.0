import { EmailValidation } from "../../presentation/helpers/validators/email-validation";
import { NameValidation } from "../../presentation/helpers/validators/name-validation";
import { PasswordValidation } from "../../presentation/helpers/validators/password-validation";
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-fields-validation";
import type { Validation } from "../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import {
  UtilNameValidator,
  UtilPasswordValidator,
  UtilValidateEmail,
} from "../../utils";

export const makeSignUpValidation = () => {
  const validations: Array<Validation> = [];

  for (const field of ["name", "password", "email"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation("email", new UtilValidateEmail()));
  validations.push(new NameValidation("name", new UtilNameValidator()));
  validations.push(
    new PasswordValidation("password", new UtilPasswordValidator())
  );

  return new ValidationComposite(validations);
};
