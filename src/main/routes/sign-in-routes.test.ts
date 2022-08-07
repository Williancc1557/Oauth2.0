import { mongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";
import request from "supertest";
import type { AccountModel } from "../../domain/models/account";

jest.setTimeout(20000);

describe("SignIn routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect();
    const accountCollection = mongoHelper.getCollection("account");
    await (
      await accountCollection
    ).insertOne({
      email: "valid_mail@mail.com",
      name: "valid_name",
      password: "valid_password",
      refreshToken: "valid_refresh_token",
    } as AccountModel);
  });

  afterAll(async () => {
    const accountCollection = await mongoHelper.getCollection("account");
    await accountCollection.deleteMany({});
    await mongoHelper.disconnect();
  });

  test("should return new refreshToken if success", async () => {
    const req = await request(app).post("/api/sign-in").send({
      email: "valid_mail@mail.com",
      password: "valid_password",
    });

    expect(req.body.refreshToken).toBeTruthy();
    expect(req.statusCode).toBe(200);
  });
});
