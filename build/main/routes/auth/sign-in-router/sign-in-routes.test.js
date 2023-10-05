"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_helper_1 = require("../../../../infra/db/mongodb/helpers/mongo-helper");
const app_1 = __importDefault(require("../../../config/app"));
const supertest_1 = __importDefault(require("supertest"));
describe("SignIn routes", () => {
    beforeAll(async () => {
        await mongo_helper_1.mongoHelper.connect();
        await (0, supertest_1.default)(app_1.default).post("/api/auth/sign-up").send({
            name: "user_name",
            email: "valid_mail@mail.com",
            password: "valid_password",
        });
    });
    afterAll(async () => {
        const accountCollection = await mongo_helper_1.mongoHelper.getCollection("account");
        await accountCollection.deleteMany({});
        await mongo_helper_1.mongoHelper.disconnect();
    });
    test("should return new refreshToken if success", async () => {
        const req = await (0, supertest_1.default)(app_1.default).post("/api/auth/sign-in").send({
            email: "valid_mail@mail.com",
            password: "valid_password",
        });
        expect(req.body.refreshToken).toBeTruthy();
        expect(req.statusCode).toBe(200);
    });
});
