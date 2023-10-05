"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_helper_1 = require("../helpers/mongo-helper");
const get_refresh_token_1 = require("./get-refresh-token");
const makeSut = () => {
    const sut = new get_refresh_token_1.GetRefreshTokenMongoRepository();
    return {
        sut,
    };
};
describe("GetRefreshToken", () => {
    beforeAll(async () => {
        await mongo_helper_1.mongoHelper.connect();
        const accountCollection = mongo_helper_1.mongoHelper.getCollection("account");
        await (await accountCollection).insertOne({
            email: "valid_mail@mail.com",
            name: "valid_name",
            password: "valid_password",
            refreshToken: "1234",
        });
    });
    afterAll(async () => {
        const accountCollection = await mongo_helper_1.mongoHelper.getCollection("account");
        await accountCollection.deleteMany({});
        await mongo_helper_1.mongoHelper.disconnect();
    });
    test("should return account", async () => {
        const { sut } = makeSut();
        const account = await sut.get("1234");
        expect(account.id).toBeTruthy();
        expect(account).toStrictEqual(expect.objectContaining({
            email: "valid_mail@mail.com",
            name: "valid_name",
            password: "valid_password",
            refreshToken: "1234",
        }));
    });
    test("should return undefined if account don't exists", async () => {
        const { sut } = makeSut();
        const account = await sut.get("2345");
        expect(account).toBeUndefined();
    });
});
