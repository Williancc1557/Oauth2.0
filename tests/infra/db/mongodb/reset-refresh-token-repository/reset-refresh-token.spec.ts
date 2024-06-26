import { ObjectId } from "mongodb";
import type { CreateRefreshToken } from "../../../../../src/data/protocols";
import { ResetRefreshTokenMongoRepository } from "../../../../../src/infra/db/mongodb/reset-refresh-token-repository/reset-refresh-token-repository";
import { mongoHelper } from "../../../../../src/infra/db/mongodb/helpers/mongo-helper";
import type { AccountModel } from "../../../../../src/domain/models/account";

const makeCreateRefreshTokenStub = () => {
  class CreateRefreshTokenStub implements CreateRefreshToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public create(): string {
      return "new_refresh_token";
    }
  }

  return new CreateRefreshTokenStub();
};

const makeSut = () => {
  const createRefreshTokenStub = makeCreateRefreshTokenStub();
  const sut = new ResetRefreshTokenMongoRepository(createRefreshTokenStub);

  return {
    sut,
    createRefreshTokenStub,
  };
};

describe("ResetRefreshTokenMongoRepository", () => {
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
    const accountCollection = await mongoHelper.getCollection("account");
    await accountCollection.deleteMany({});
    await mongoHelper.disconnect();
  });

  test("should return refreshToken if success", async () => {
    const { sut } = makeSut();

    const res = await sut.reset(id);

    const accountCollection = await mongoHelper.getCollection("account");
    await accountCollection.findOne({
      _id: new ObjectId(id),
    });

    expect(res).toBe("new_refresh_token");
  });

  test("should update account's refreshToken", async () => {
    const { sut } = makeSut();

    await sut.reset(id);

    const accountCollection = await mongoHelper.getCollection("account");
    const account = await accountCollection.findOne({
      _id: new ObjectId(id),
    });

    expect(account.refreshToken).toBe("new_refresh_token");
  });
});
