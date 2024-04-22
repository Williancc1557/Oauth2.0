import { makeSignInValidation } from "../../../src/main/factories/sign-in/sign-in-validation";
import { EmailValidation } from "../../../src/presentation/helpers/validators/email-validation/email-validation";
import { PasswordValidation } from "../../../src/presentation/helpers/validators/password-validation/password-validation";
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/required-field-validation/required-field-validation";
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validation-composite";
import type { Validation } from "../../../src/presentation/protocols/validation";
import { UtilPasswordValidator, UtilValidateEmail } from "../../../src/utils";

jest.mock("../../../src/presentation/helpers/validators/validation-composite");

describe("TokenInfo Validation", () => {
  test("should call ValidationComposite with valid Validations", () => {
    makeSignInValidation();
    const validations: Array<Validation> = [];

    for (const field of ["password", "email"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation("email", new UtilValidateEmail()));
    validations.push(
      new PasswordValidation("password", new UtilPasswordValidator())
    );

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
