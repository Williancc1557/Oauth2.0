import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-fields-validation/required-fields-validation";
import type { Validation } from "../../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";

export const makeRefreshTokenValidation = () => {
  const validations: Array<Validation> = [];

  for (const field of ["refreshtoken"]) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
};
