import { RefreshTokenController } from "./refresh-token";

describe("RefreshToken Controller", () => {
  test("should return 400 if acessToken is not provided", async () => {
    const sut = new RefreshTokenController();

    const req = await sut.handle({});

    expect(req.statusCode).toBe(400);
  });
});
