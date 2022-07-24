import type { AccountModel } from "../../../../domain/models/account";
import { mongoHelper } from "../helpers/mongo-helper";
import { GetRefreshTokenMongoRepository } from "./get-refresh-token";

const makeSut = () => {
  const sut = new GetRefreshTokenMongoRepository();

  return {
    sut,
  };
};

describe("GetRefreshToken", () => {
  beforeAll(async () => {
    await mongoHelper.connect();
    const accountCollection = mongoHelper.getCollection("account");
    await (
      await accountCollection
    ).insertOne({
      email: "valid_mail@mail.com",
      name: "valid_name",
      password: "valid_password",
      refreshToken: "1234",
    } as AccountModel);
  });

  afterAll(async () => {
    const accountCollection = await mongoHelper.getCollection("account");
    await accountCollection.deleteMany({});
    await mongoHelper.disconnect();
  });

  test("should return account", async () => {
    const { sut } = makeSut();

    const account = await sut.get("1234");

    expect(account.id).toBeTruthy();
    expect(account).toStrictEqual(
      expect.objectContaining({
        email: "valid_mail@mail.com",
        name: "valid_name",
        password: "valid_password",
        refreshToken: "1234",
      })
    );
  });

  test("should return undefined if account don't exists", async () => {
    const { sut } = makeSut();

    const account = await sut.get("2345");

    expect(account).toBeUndefined();
  });
});
