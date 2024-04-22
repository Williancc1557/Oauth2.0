import request from "supertest";
import { mongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper";
import app from "../../../api";
import { UtilCreateAccessToken } from "../../../src/utils";

const getRandomAccessToken = () => {
  const utilCreateAccessToken = new UtilCreateAccessToken();
  const userId = "fake-user-id";
  return utilCreateAccessToken.create(userId).accessToken;
};

let token: string;

describe("VerifyAccessToken router", () => {
  beforeAll(async () => {
    await mongoHelper.connect();
    token = getRandomAccessToken();
  });

  afterAll(async () => {
    const accountCollection = await mongoHelper.getCollection("account");
    await accountCollection.deleteMany({});
    await mongoHelper.disconnect();
  });

  test("should return true if success", async () => {
    const req = await request(app).get("/api/auth/check-token").set({
      authorization: token,
    });

    expect(req.body).toBe(true);
    expect(req.statusCode).toBe(200);
  });

  test("should return false if was provided an invalid access token", async () => {
    const req = await request(app).get("/api/auth/check-token").set({
      authorization: "invalid-access-token",
    });

    expect(req.body).toBe(false);
    expect(req.statusCode).toBe(200);
  });
});
