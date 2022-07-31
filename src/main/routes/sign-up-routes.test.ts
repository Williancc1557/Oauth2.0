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

  test("should return an account if success", async () => {
    const req = await request(app).post("/api/sign-up").send({
      name: "valid_name",
      email: "valid_mail@mail.com",
      password: "valid_password",
    });

    expect(req.body.refreshToken).toBeTruthy();
    expect(req.body.id).toBeTruthy();
    expect(req.body.acessToken).toBeTruthy();
    expect(req.body.password).toBeTruthy();

    expect(req.body).toStrictEqual(
      expect.objectContaining({
        name: "valid_name",
        email: "valid_mail@mail.com",
      })
    );
    expect(req.statusCode).toBe(200);
  });
});
