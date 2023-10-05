"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongo_helper_1 = require("../helpers/mongo-helper");
const reset_refresh_token_repository_1 = require("./reset-refresh-token-repository");
const makeCreateRefreshTokenStub = () => {
    class CreateRefreshTokenStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        create() {
            return "new_refresh_token";
        }
    }
    return new CreateRefreshTokenStub();
};
const makeSut = () => {
    const createRefreshTokenStub = makeCreateRefreshTokenStub();
    const sut = new reset_refresh_token_repository_1.ResetRefreshTokenMongoRepository(createRefreshTokenStub);
    return {
        sut,
        createRefreshTokenStub,
    };
};
describe("ResetRefreshTokenMongoRepository", () => {
    let id;
    beforeAll(async () => {
        await mongo_helper_1.mongoHelper.connect();
        const accountCollection = mongo_helper_1.mongoHelper.getCollection("account");
        const { insertedId } = await (await accountCollection).insertOne({
            email: "valid_mail@mail.com",
            name: "valid_name",
            password: "valid_password",
            refreshToken: "1234",
        });
        id = String(insertedId);
    });
    afterAll(async () => {
        const accountCollection = await mongo_helper_1.mongoHelper.getCollection("account");
        await accountCollection.deleteMany({});
        await mongo_helper_1.mongoHelper.disconnect();
    });
    test("should return refreshToken if success", async () => {
        const { sut } = makeSut();
        const res = await sut.reset(id);
        const accountCollection = await mongo_helper_1.mongoHelper.getCollection("account");
        await accountCollection.findOne({
            _id: new mongodb_1.ObjectId(id),
        });
        expect(res).toBe("new_refresh_token");
    });
    test("should update account's refreshToken", async () => {
        const { sut } = makeSut();
        await sut.reset(id);
        const accountCollection = await mongo_helper_1.mongoHelper.getCollection("account");
        const account = await accountCollection.findOne({
            _id: new mongodb_1.ObjectId(id),
        });
        expect(account.refreshToken).toBe("new_refresh_token");
    });
});
