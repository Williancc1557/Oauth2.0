import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation/required-field-validation";
import type { Validation } from "../../../presentation/protocols/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import { makeRefreshTokenValidation } from "./refresh-token-validation";

jest.mock("../../../presentation/helpers/validators/validation-composite");

describe("TokenInfo Validation", () => {
  test("should call ValidationComposite with valid Validations", () => {
    makeRefreshTokenValidation();
    const validations: Array<Validation> = [];

    for (const field of ["refreshtoken"]) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toBeCalledWith(validations);
  });
});
