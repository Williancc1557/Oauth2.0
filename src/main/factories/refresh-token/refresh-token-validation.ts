import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation/required-field-validation";
import type { Validation } from "../../../presentation/protocols/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";

export const makeRefreshTokenValidation = () => {
  const validations: Array<Validation> = [];

  for (const field of ["refreshtoken"]) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
};
