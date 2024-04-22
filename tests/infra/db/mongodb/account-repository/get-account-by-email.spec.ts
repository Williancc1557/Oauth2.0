import type { AccountModel } from "../../../../../src/domain/models/account";
import { mongoHelper } from "../../../../../src/infra/db/mongodb/helpers/mongo-helper";
import { GetAccountByEmailMongoRepository } from "../../../../../src/infra/db/mongodb/account-repository/get-account-by-email-repository";

const makeSut = () => {
  const sut = new GetAccountByEmailMongoRepository();

  return {
    sut,
  };
};

describe("GetAccountByEmailMongoRepository", () => {
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
    await mongoHelper.disconnect();
  });

  test("should return account if success", async () => {
    const { sut } = makeSut();

    const req = await sut.get("valid_mail@mail.com");

    expect(req.refreshToken).toBeTruthy();
    expect(req.id).toBeTruthy();
    expect(req.password).toBeTruthy();
    expect(req).toStrictEqual(
      expect.objectContaining({
        email: "valid_mail@mail.com",
        name: "valid_name",
      })
    );
  });
});
