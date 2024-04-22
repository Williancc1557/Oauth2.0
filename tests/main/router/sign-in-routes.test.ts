import request from "supertest";
import { mongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper";
import app from "../../../api";

describe("SignIn routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect();
    await request(app).post("/api/auth/sign-up").send({
      name: "user_name",
      email: "valid_mail@mail.com",
      password: "valid_password",
    });
  });

  afterAll(async () => {
    const accountCollection = await mongoHelper.getCollection("account");
    await accountCollection.deleteMany({});
    await mongoHelper.disconnect();
  });

  test("should return new refreshToken if success", async () => {
    const req = await request(app).post("/api/auth/sign-in").send({
      email: "valid_mail@mail.com",
      password: "valid_password",
    });

    expect(req.body.refreshToken).toBeTruthy();
    expect(req.statusCode).toBe(200);
  });
});
