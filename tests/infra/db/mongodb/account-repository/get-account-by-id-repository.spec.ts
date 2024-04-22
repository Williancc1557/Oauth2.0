import type { AccountModel } from "../../../../../src/domain/models/account";
import { mongoHelper } from "../../../../../src/infra/db/mongodb/helpers/mongo-helper";
import { GetAccountByIdMongoRepository } from "../../../../../src/infra/db/mongodb/account-repository/get-account-by-id-repository";

const makeSut = () => {
  const sut = new GetAccountByIdMongoRepository();

  return {
    sut,
  };
};

describe("GetAccountByIdMongoRepository", () => {
  let id: string;

  beforeAll(async () => {
    await mongoHelper.connect();
    const accountCollection = mongoHelper.getCollection("account");
    const { insertedId } = await (
      await accountCollection
    ).insertOne({
      email: "valid_mail@mail.com",
      name: "valid_name",
      password: "valid_password",
      refreshToken: "1234",
    } as AccountModel);

    id = String(insertedId);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  test("should return account if success", async () => {
    const { sut } = makeSut();

    const req = await sut.get(id);

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
