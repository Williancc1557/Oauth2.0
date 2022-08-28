import { InvalidParamError } from "../../errors";
import type { PasswordValidator } from "../../protocols/password-validator";
import { PasswordValidation } from "./password-validation";

const makePasswordValidator = (): PasswordValidator => {
  class PasswordValidatorStub implements PasswordValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(email: string): boolean {
      return true;
    }
  }
  return new PasswordValidatorStub();
};

const makeSut = () => {
  const passwordValidatorStub = makePasswordValidator();
  const sut = new PasswordValidation("password", passwordValidatorStub);

  return {
    sut,
    passwordValidatorStub,
  };
};

describe("Password Validation", () => {
  test("should return error if password is not valid", async () => {
    const { sut, passwordValidatorStub } = makeSut();
    jest.spyOn(passwordValidatorStub, "validate").mockReturnValueOnce(false);
    const response = sut.validate({ password: "any_password" });

    expect(response).toStrictEqual(new InvalidParamError("password"));
  });

  test("should call passwordValidator with correct password", async () => {
    const { sut, passwordValidatorStub } = makeSut();
    const validateSpy = jest.spyOn(passwordValidatorStub, "validate");
    sut.validate({ password: "any_password" });

    expect(validateSpy).toHaveBeenCalledWith("any_password");
  });

  test("should throw if passwordValidator throws", async () => {
    const { sut, passwordValidatorStub } = makeSut();
    jest.spyOn(passwordValidatorStub, "validate").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
