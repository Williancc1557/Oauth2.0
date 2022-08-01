import { UtilRequiredParams } from "./required-params";

const makeSut = () => {
  const sut = new UtilRequiredParams();

  return {
    sut,
  };
};

describe("UtilRequiredParams", () => {
  test("should return false if requirementParam is not valid in body", () => {
    const { sut } = makeSut();

    const requiredParams = ["name", "password"];
    const res = sut.check(requiredParams, {});

    expect(res).toBe(false);
  });
});
