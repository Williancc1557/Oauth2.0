import jwt from "jsonwebtoken";
import { UtilCreateRefreshToken } from "./create-refresh-token";

describe("CreateRefreshToken", () => {
  test("should return refreshToken if sucess", () => {
    const sut = new UtilCreateRefreshToken();
    jest.spyOn(jwt, "sign");

    const res = sut.create("user_id");

    expect(res).toBeTruthy();
  });
});
