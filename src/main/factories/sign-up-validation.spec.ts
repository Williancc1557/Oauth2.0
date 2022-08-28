import { RequiredFieldValidation } from "../../presentation/helpers/validatiors/required-fields-validation";
import type { Validation } from "../../presentation/helpers/validatiors/validation";
import { ValidationComposite } from "../../presentation/helpers/validatiors/validation-composite";
import { makeSignUpValidation } from "./sign-up-validation";

jest.mock("../../presentation/helpers/validatiors/validation-composite");

describe("TokenInfo Validation", () => {
  test("should call ValidationComposite with valid Validations", () => {
    makeSignUpValidation();
    const validations: Array<Validation> = [];

    for (const field of ["name", "password", "email"]) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toBeCalledWith(validations);
  });
});
