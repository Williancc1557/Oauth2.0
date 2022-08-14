import { mongoHelper } from "../../../../infra/db/mongodb/helpers/mongo-helper";
import app from "../../../config/app";
import request from "supertest";

const makeTokens = async () => {
  const res = await request(app).post("/api/auth/sign-up").send({
    name: "valid_name",
    email: "valid_mail@mail.com",
    password: "valid_password",
  });

  return {
    refreshToken: res.body.refreshToken,
    accessToken: res.body.accessToken,
  };
};

describe("TokenInfo routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect();
  });

  afterAll(async () => {
    const accountCollection = await mongoHelper.getCollection("account");
    await accountCollection.deleteMany({});
    await mongoHelper.disconnect();
  });

  test("should return valid body if success", async () => {
    const tokens = await makeTokens();
    const req = await request(app).get("/api/auth/token-info").set({
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
    });

    console.log(req.body);

    expect(req.body.exp).toBeTruthy();
    expect(req.body.iat).toBeTruthy();
    expect(req.statusCode).toBe(200);
  });
});
