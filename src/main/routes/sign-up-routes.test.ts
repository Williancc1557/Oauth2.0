import { mongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";
import request from "supertest";

describe("SignUp routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect();
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  test("should return acessToken and refreshToken if success", async () => {
    const req = await request(app).post("/api/sign-up").send({
      name: "valid_name",
      email: "valid_mail@mail.com",
      password: "valid_password",
    });
    console.log(req.body);

    expect(req.body.refreshToken).toBeTruthy();
    expect(req.body.acessToken).toBeTruthy();
    expect(req.statusCode).toBe(200);
  });
});
