import { MissingParamError } from "../../../errors";
import { RequiredFieldValidation } from "./required-field-validation";

const makeSut = () => {
  const sut = new RequiredFieldValidation("email");

  return {
    sut,
  };
};

describe("RequiredField validation", () => {
  test("should return MissingParamError if the field is not provided", () => {
    const { sut } = makeSut();
    const res = sut.validate({});

    expect(res).toStrictEqual(new MissingParamError("email"));
  });

  test("should return null if validation succeeds", () => {
    const { sut } = makeSut();
    const res = sut.validate({});

    expect(res).toStrictEqual(new MissingParamError("email"));
  });
});
