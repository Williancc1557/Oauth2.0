import { UtilRequiredParams } from "./required-params";

const makeSut = () => {
  const sut = new UtilRequiredParams();

  return {
    sut,
  };
};

describe("UtilRequiredParams", () => {
  test("should return param if requirementParam is not valid in body", () => {
    const { sut } = makeSut();

    const requiredParams = ["name", "password"];
    const res = sut.check(requiredParams, {});

    expect(res).toBe("name");
  });

  test("should return undefined if success", () => {
    const { sut } = makeSut();

    const requiredParams = ["name", "password"];
    const res = sut.check(requiredParams, {
      name: "valid_name",
      password: "valid_password",
    });

    expect(res).toBeUndefined();
  });
});
