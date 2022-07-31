import { UtilEncrypter } from "./encrypter";
import bcrypt from "bcrypt";

const makeSut = () => {
  const sut = new UtilEncrypter(10);

  return {
    sut,
  };
};

describe("Encrypter", () => {
  test("should return a string if sucess", async () => {
    const { sut } = makeSut();

    const res = await sut.hash("valid_value");

    expect(res).toBeTruthy();
  });

  test("should throw if bcrypt.hash throws", async () => {
    const { sut } = makeSut();

    jest.spyOn(bcrypt, "hash").mockRejectedValueOnce(new Error() as never);

    const res = sut.hash("valid_value");

    await expect(res).rejects.toThrow();
  });
});
