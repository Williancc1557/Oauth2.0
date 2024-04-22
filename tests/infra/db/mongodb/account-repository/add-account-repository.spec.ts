import type {
  CreateAccessToken,
  CreateAccessTokenOutput,
} from "../../../../../src/data/protocols/create-access-token";
import type { CreateRefreshToken } from "../../../../../src/data/protocols/create-refresh-token";
import { mongoHelper } from "../../../../../src/infra/db/mongodb/helpers/mongo-helper";
import { AddAccountMongoRepository } from "../../../../../src/infra/db/mongodb/account-repository/add-account-repository";

const makeCreateRefreshTokenStub = () => {
  class CreateRefreshTokenStub implements CreateRefreshToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public create(): string {
      return "valid_refresh_token";
    }
  }

  return new CreateRefreshTokenStub();
};

const makeCreateAccessTokenStub = () => {
  class CreateAccessTokenStub implements CreateAccessToken {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public create(userId: string): CreateAccessTokenOutput {
      return { accessToken: "valid_refresh_token", expiresIn: 300 };
    }
  }

  return new CreateAccessTokenStub();
};

const makeSut = () => {
  const createRefreshTokenStub = makeCreateRefreshTokenStub();
  const createAccessTokenStub = makeCreateAccessTokenStub();
  const sut = new AddAccountMongoRepository(
    createRefreshTokenStub,
    createAccessTokenStub
  );

  return {
    sut,
    createRefreshTokenStub,
  };
};

describe("AddAccountMongoRepository", () => {
  beforeAll(async () => {
    await mongoHelper.connect();
  });

  afterAll(async () => {
    const accountCollection = mongoHelper.getCollection("account");
    await (await accountCollection).deleteMany({});
    await mongoHelper.disconnect();
  });

  test("should return account if success", async () => {
    const { sut } = makeSut();

    const req = await sut.add({
      email: "valid_mail@mail.com",
      name: "valid_name",
      password: "valid_password",
    });

    expect(req.refreshToken).toBeTruthy();
    expect(req.accessToken).toBeTruthy();
    expect(req.id).toBeTruthy();
    expect(req).toStrictEqual(
      expect.objectContaining({
        email: "valid_mail@mail.com",
        name: "valid_name",
        password: "valid_password",
      })
    );
  });
});
