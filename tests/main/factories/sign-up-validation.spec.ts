import { makeSignUpValidation } from "../../../src/main/factories/sign-up/sign-up-validation";
import { EmailValidation } from "../../../src/presentation/helpers/validators/email-validation/email-validation";
import { NameValidation } from "../../../src/presentation/helpers/validators/name-validation/name-validation";
import { PasswordValidation } from "../../../src/presentation/helpers/validators/password-validation/password-validation";
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/required-field-validation/required-field-validation";
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validation-composite";
import type { Validation } from "../../../src/presentation/protocols/validation";
import {
  UtilNameValidator,
  UtilPasswordValidator,
  UtilValidateEmail,
} from "../../../src/utils";

jest.mock("../../../src/presentation/helpers/validators/validation-composite");

describe("TokenInfo Validation", () => {
  test("should call ValidationComposite with valid Validations", () => {
    makeSignUpValidation();
    const validations: Array<Validation> = [];

    for (const field of ["name", "password", "email"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation("email", new UtilValidateEmail()));
    validations.push(new NameValidation("name", new UtilNameValidator()));
    validations.push(
      new PasswordValidation("password", new UtilPasswordValidator())
    );

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
