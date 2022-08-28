import { RequiredFieldValidation } from "../../presentation/helpers/validatiors/required-fields-validation";
import type { Validation } from "../../presentation/helpers/validatiors/validation";
import { ValidationComposite } from "../../presentation/helpers/validatiors/validation-composite";
import { makeTokenInfoValidation } from "./token-info-validation";

jest.mock("../../presentation/helpers/validatiors/validation-composite");

describe("TokenInfo Validation", () => {
  test("should call ValidationComposite with valid Validations", () => {
    makeTokenInfoValidation();
    const validations: Array<Validation> = [];

    for (const field of ["accessToken"]) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toBeCalledWith(validations);
  });
});
