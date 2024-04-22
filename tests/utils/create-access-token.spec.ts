import { UtilCreateAccessToken } from "../../src/utils/create-access-token";
import jwt from "jsonwebtoken";

describe("CreateAccessToken", () => {
  test("should return accessToken if success", () => {
    const sut = new UtilCreateAccessToken();
    jest.spyOn(jwt, "sign");

    const res = sut.create("user_id");

    expect(res).toBeTruthy();
  });
});
