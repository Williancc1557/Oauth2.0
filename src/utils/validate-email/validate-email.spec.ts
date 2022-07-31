import { UtilValidateEmail } from "./validate-email";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): UtilValidateEmail => {
  return new UtilValidateEmail();
};

describe("EmailValidator Adapter", () => {
  test("should return false if validator returns false", () => {
    const sut = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const validate = sut.validate("invalid_email@email.com");

    expect(validate).toBe(false);
  });

  test("should return true if validator returns true", () => {
    const sut = makeSut();
    const validate = sut.validate("valid_email@email.com");

    expect(validate).toBe(true);
  });

  test("should call validator with correct email", () => {
    const sut = makeSut();
    const isEmailSpy = jest.spyOn(validator, "isEmail");
    sut.validate("any_email@email.com");

    expect(isEmailSpy).toHaveBeenCalledWith("any_email@email.com");
  });
});
