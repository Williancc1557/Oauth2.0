import type { RequiredParams } from "../../protocols";
import { TokenInfoController } from "./token-info";

const makeRequiredParamsStub = () => {
  class RequiredParamsStub implements RequiredParams {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public check(requiredParams: Array<string>, body: any): string {
      return;
    }
  }

  return new RequiredParamsStub();
};

const makeSut = () => {
  const requiredParamsStub = makeRequiredParamsStub();
  const sut = new TokenInfoController(requiredParamsStub);
  return {
    sut,
    requiredParamsStub,
  };
};

describe("TokenInfo controller", () => {
  test("should return statusCode 400 if any param requested is not provided", async () => {
    const { sut, requiredParamsStub } = makeSut();

    jest.spyOn(requiredParamsStub, "check").mockReturnValueOnce("refreshToken");

    const httpRequest = {
      accessToken: "valid_access_token",
    };

    const res = await sut.handle({ body: httpRequest });

    expect(res.statusCode).toBe(400);
  });
});
