import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import type { Validation } from "../../../presentation/protocols/validation";

export const makeTokenInfoValidation = () => {
  const validations: Array<Validation> = [];

  for (const field of ["authorization"]) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
};
