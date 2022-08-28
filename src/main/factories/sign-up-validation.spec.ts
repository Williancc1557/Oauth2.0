import { EmailValidation } from "../../presentation/helpers/validators/email-validation";
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-fields-validation";
import type { Validation } from "../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import { UtilValidateEmail } from "../../utils";
import { makeSignUpValidation } from "./sign-up-validation";

jest.mock("../../presentation/helpers/validators/validation-composite");

describe("TokenInfo Validation", () => {
  test("should call ValidationComposite with valid Validations", () => {
    makeSignUpValidation();
    const validations: Array<Validation> = [];

    for (const field of ["name", "password", "email"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation("email", new UtilValidateEmail()));

    expect(ValidationComposite).toBeCalledWith(validations);
  });
});
