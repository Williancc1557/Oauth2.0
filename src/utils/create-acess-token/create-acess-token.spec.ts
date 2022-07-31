import { UtilCreateAcessToken } from "./create-acess-token";
import jwt from "jsonwebtoken";

describe("CreateAcessToken", () => {
  test("should return acessToken if sucess", () => {
    const sut = new UtilCreateAcessToken();
    jest.spyOn(jwt, "sign");

    const res = sut.create("user_id");

    expect(res).toBeTruthy();
  });
});
