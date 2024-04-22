import { UtilCreateAccessToken } from "../../src/utils/create-access-token";
import { UtilGetTokenInfo } from "../../src/utils/get-token-info";

const { accessToken } = new UtilCreateAccessToken().create("valid_id");

describe("UtilGetTokenInfo", () => {
  test("should return valid values if success", () => {
    const sut = new UtilGetTokenInfo();

    const res = sut.get(accessToken);

    expect(res).toStrictEqual(
      expect.objectContaining({
        sub: "valid_id",
      })
    );
    expect(res.exp).toBeTruthy();
    expect(res.iat).toBeTruthy();
  });
});
