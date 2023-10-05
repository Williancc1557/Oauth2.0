"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_helper_1 = require("../../../../infra/db/mongodb/helpers/mongo-helper");
const app_1 = __importDefault(require("../../../config/app"));
const supertest_1 = __importDefault(require("supertest"));
const makeTokens = async () => {
    const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/sign-up").send({
        name: "valid_name",
        email: "valid_mail@mail.com",
        password: "valid_password",
    });
    return {
        refreshToken: res.body.refreshToken,
        accessToken: res.body.accessToken,
    };
};
let tokens;
describe("TokenInfo routes", () => {
    beforeAll(async () => {
        await mongo_helper_1.mongoHelper.connect();
        tokens = await makeTokens();
    });
    afterAll(async () => {
        const accountCollection = await mongo_helper_1.mongoHelper.getCollection("account");
        await accountCollection.deleteMany({});
        await mongo_helper_1.mongoHelper.disconnect();
    });
    test("should return valid body if success", async () => {
        const req = await (0, supertest_1.default)(app_1.default).get("/api/auth/token-info").set({
            refreshtoken: tokens.refreshToken,
            accesstoken: tokens.accessToken,
        });
        expect(req.body.exp).toBeTruthy();
        expect(req.body.sub).toBeTruthy();
        expect(req.body.iat).toBeTruthy();
        expect(req.statusCode).toBe(200);
    });
});
