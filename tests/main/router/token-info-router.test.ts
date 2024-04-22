import request from "supertest";
import { mongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper";
import app from "../../../api";

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

let tokens: { refreshToken: string; accessToken: string };

describe("TokenInfo routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect();
    tokens = await makeTokens();
  });

  afterAll(async () => {
    const accountCollection = await mongoHelper.getCollection("account");
    await accountCollection.deleteMany({});
    await mongoHelper.disconnect();
  });

  test("should return valid body if success", async () => {
    const req = await request(app).get("/api/auth/token-info").set({
      refreshtoken: tokens.refreshToken,
      authorization: tokens.accessToken,
    });

    expect(req.body.exp).toBeTruthy();
    expect(req.body.sub).toBeTruthy();
    expect(req.body.iat).toBeTruthy();
    expect(req.statusCode).toBe(200);
  });
});
