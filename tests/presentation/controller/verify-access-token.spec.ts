import { VerifyAccessTokenController } from "../../../src/presentation/controller/verify-access-token";
import { ok, serverError } from "../../../src/presentation/helpers/http-helper";
import type { HttpRequest } from "../../../src/presentation/protocols";

const makeSut = () => {
  const verifyAccessTokenStub = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    verify: jest.fn((accessToken: string) => true),
  };

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

  test("should return false if access token is not valid", async () => {
    const { sut, verifyAccessTokenStub } = makeSut();
    verifyAccessTokenStub.verify.mockReturnValue(false);

    const data = await sut.handle(fakeData);

    expect(data).toStrictEqual(ok(false));
  });

  test("should call verify with correct values", () => {
    const { sut, verifyAccessTokenStub } = makeSut();

    sut.handle(fakeData);

    expect(verifyAccessTokenStub.verify).toHaveBeenCalledWith(
      fakeData.header.authorization
    );
  });

  test("should return server error if verify method throws", async () => {
    const { sut, verifyAccessTokenStub } = makeSut();
    verifyAccessTokenStub.verify.mockImplementation(() => {
      throw new Error();
    });

    const data = await sut.handle(fakeData);

    expect(data).toStrictEqual(serverError());
  });
});
