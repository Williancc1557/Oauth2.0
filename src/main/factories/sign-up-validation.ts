import { RequiredFieldValidation } from "../../presentation/helpers/validatiors/required-fields-validation";
import type { Validation } from "../../presentation/helpers/validatiors/validation";
import { ValidationComposite } from "../../presentation/helpers/validatiors/validation-composite";

export const makeSignUpValidation = () => {
  const validations: Array<Validation> = [];

  for (const field of ["name", "password", "email"]) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
};
