import { VerifyAccessTokenController } from "../../../src/presentation/controller/verify-access-token";
import { ok } from "../../../src/presentation/helpers/http-helper";
import type { HttpRequest } from "../../../src/presentation/protocols";
import type { VerifyAccessToken } from "../../../src/presentation/protocols/verify-access-token";

const makeSut = () => {
  const verifyAccessTokenStub = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    verify: jest.fn((accessToken: string) => true),
  } as VerifyAccessToken;

  const sut = new VerifyAccessTokenController(verifyAccessTokenStub);

  return {
    sut,
    verifyAccessTokenStub,
  };
};

const fakeData: HttpRequest = {
  header: {
    authorization: "valid_access_token",
  },
};

describe("VerifyAccessToken Controller", () => {
  test("should return true if access token is valid", async () => {
    const { sut } = makeSut();

    const data = await sut.handle(fakeData);

    expect(data).toStrictEqual(ok(true));
  });
});
