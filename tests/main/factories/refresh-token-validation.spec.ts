import { makeRefreshTokenValidation } from "../../../src/main/factories/refresh-token/refresh-token-validation";
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/required-field-validation";
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validation-composite";
import type { Validation } from "../../../src/presentation/protocols/validation";

jest.mock("../../../src/presentation/helpers/validators/validation-composite");

describe("TokenInfo Validation", () => {
  test("should call ValidationComposite with valid Validations", () => {
    makeRefreshTokenValidation();
    const validations: Array<Validation> = [];

    for (const field of ["refreshtoken"]) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
