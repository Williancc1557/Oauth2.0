import { UtilVerifyAccessToken } from "./verify-access-token";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  verify() {
    return {};
  },
}));

const makeSut = () => {
  const sut = new UtilVerifyAccessToken();

  return {
    sut,
  };
};

describe("UtilVerifyAccessToken", () => {
  test("should return true if success", () => {
    const { sut } = makeSut();
    const res = sut.verify("accessToken");

    expect(res).toBe(true);
  });

  test("should return false if jwt throws", async () => {
    const { sut } = makeSut();

    jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.verify("accessToken")).toBe(false);
  });
});
