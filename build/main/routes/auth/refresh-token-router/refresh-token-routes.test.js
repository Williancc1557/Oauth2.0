"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../../../config/app"));
const supertest_1 = __importDefault(require("supertest"));
const mongo_helper_1 = require("../../../../infra/db/mongodb/helpers/mongo-helper");
describe("RefreshToken routes", () => {
    beforeAll(async () => {
        await mongo_helper_1.mongoHelper.connect();
        const accountCollection = mongo_helper_1.mongoHelper.getCollection("account");
        await (await accountCollection).insertOne({
            email: "valid_mail@mail.com",
            name: "valid_name",
            password: "valid_password",
            refreshToken: "valid_refresh_token",
        });
    });
    afterAll(async () => {
        const accountCollection = await mongo_helper_1.mongoHelper.getCollection("account");
        await accountCollection.deleteMany({});
        await mongo_helper_1.mongoHelper.disconnect();
    });
    test("should return an accessToken on success", async () => {
        const req = await (0, supertest_1.default)(app_1.default).get("/api/auth/refresh-token").set({
            refreshToken: "valid_refresh_token",
        });
        expect(req.body.accessToken).toBeTruthy();
        expect(req.statusCode).toBe(200);
    });
});
