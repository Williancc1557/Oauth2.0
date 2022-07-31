import app from "../config/app";
import request from "supertest";
import { mongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import type { AccountModel } from "../../domain/models/account";

describe("RefresbToken routes", () => {
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
    await mongoHelper.disconnect();
  });

  test("should return an acessToken on sucess", async () => {
    const req = await request(app).post("/api/refresh-token").send({
      refreshToken: "valid_refresh_token",
    });

    expect(req.body.acessToken).toBeTruthy();
    expect(req.statusCode).toBe(200);
  });
});
