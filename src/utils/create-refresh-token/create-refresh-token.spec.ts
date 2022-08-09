import { UtilCreateRefreshToken } from "./create-refresh-token";

describe("CreateRefreshToken", () => {
  test("should return refreshToken if success", () => {
    const sut = new UtilCreateRefreshToken();

    const res = sut.create();

    expect(res).toBeTruthy();
  });
});
