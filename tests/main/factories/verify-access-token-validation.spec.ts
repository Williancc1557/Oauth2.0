import { makeAccessTokenValidation } from "../../../src/main/factories/verify-access-token/verify-access-token-validation";
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/required-field-validation";
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validation-composite";
import type { Validation } from "../../../src/presentation/protocols/validation";

jest.mock("../../../src/presentation/helpers/validators/validation-composite");

describe("TokenInfo Validation", () => {
  test("should call ValidationComposite with valid Validations", () => {
    makeAccessTokenValidation();
    const validations: Array<Validation> = [];

    for (const field of ["authorization"]) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
