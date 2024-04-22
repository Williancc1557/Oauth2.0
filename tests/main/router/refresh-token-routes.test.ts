import request from "supertest";
import type { AccountModel } from "../../../src/domain/models/account";
import { mongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper";
import app from "../../../api";

describe("RefreshToken routes", () => {
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

  test("should return an accessToken on success", async () => {
    const req = await request(app).get("/api/auth/refresh-token").set({
      refreshToken: "valid_refresh_token",
    });

    expect(req.body.accessToken).toBeTruthy();
    expect(req.statusCode).toBe(200);
  });
});
