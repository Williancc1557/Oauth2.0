import { mongoHelper } from "../../../../infra/db/mongodb/helpers/mongo-helper";
import app from "../../../config/app";
import request from "supertest";

describe("SignUp routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect();
  });

  afterAll(async () => {
    const accountCollection = await mongoHelper.getCollection("account");
    await accountCollection.deleteMany({});
    await mongoHelper.disconnect();
  });

  test("should return accessToken and refreshToken if success", async () => {
    const req = await request(app).post("/api/auth/sign-up").send({
      name: "valid_name",
      email: "valid_mail@mail.com",
      password: "valid_password",
    });

    expect(req.body.refreshToken).toBeTruthy();
    expect(req.body.accessToken).toBeTruthy();
    expect(req.body.expiresIn).toBeTruthy();
    expect(req.statusCode).toBe(200);
  });
});
