import { InvalidParamError } from "../../../../src/presentation/errors";
import type { ValidateEmail } from "../../../../src/presentation/protocols/validate-email";
import { EmailValidation } from "../../../../src/presentation/helpers/validators/email-validation";

const makeEmailValidator = (): ValidateEmail => {
  class EmailValidatorStub implements ValidateEmail {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeSut = () => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation("email", emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  };
};

describe("Email Validation", () => {
  test("should return error if email is not valid", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "validate").mockReturnValueOnce(false);
    const response = sut.validate({ email: "any_email@mail.com" });

    expect(response).toStrictEqual(new InvalidParamError("email"));
  });

  test("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const validateSpy = jest.spyOn(emailValidatorStub, "validate");
    sut.validate({ email: "any_email@mail.com" });

    expect(validateSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "validate").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
