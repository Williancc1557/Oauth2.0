import { InvalidParamError } from "../../../errors";
import type { NameValidator } from "../../../protocols/name-validator";
import { NameValidation } from "./name-validation";

const makeNameValidator = (): NameValidator => {
  class NameValidatorStub implements NameValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(email: string): boolean {
      return true;
    }
  }
  return new NameValidatorStub();
};

const makeSut = () => {
  const nameValidatorStub = makeNameValidator();
  const sut = new NameValidation("name", nameValidatorStub);

  return {
    sut,
    nameValidatorStub,
  };
};

describe("Name Validation", () => {
  test("should return error if name is not valid", async () => {
    const { sut, nameValidatorStub } = makeSut();
    jest.spyOn(nameValidatorStub, "validate").mockReturnValueOnce(false);
    const response = sut.validate({ name: "any_name" });

    expect(response).toStrictEqual(new InvalidParamError("name"));
  });

  test("should call NameValidator with correct Name", async () => {
    const { sut, nameValidatorStub } = makeSut();
    const validateSpy = jest.spyOn(nameValidatorStub, "validate");
    sut.validate({ name: "any_name" });

    expect(validateSpy).toHaveBeenCalledWith("any_name");
  });

  test("should throw if NameValidator throws", async () => {
    const { sut, nameValidatorStub } = makeSut();
    jest.spyOn(nameValidatorStub, "validate").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
