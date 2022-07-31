import { UtilNameValidator } from "./name-validator";

const makeSut = () => {
  const sut = new UtilNameValidator();

  return {
    sut,
  };
};

describe("NameValidator Util", () => {
  test("should return true if sucess", () => {
    const { sut } = makeSut();

    const res = sut.validate("valid_name");

    expect(res).toBe(true);
  });

  test("should return false if email is not valid", () => {
    const { sut } = makeSut();

    const res = sut.validate("a");

    expect(res).toBe(false);
  });
});
