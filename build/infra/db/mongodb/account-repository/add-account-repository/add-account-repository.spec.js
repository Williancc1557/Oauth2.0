"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_helper_1 = require("../../helpers/mongo-helper");
const add_account_repository_1 = require("./add-account-repository");
const makeCreateRefreshTokenStub = () => {
    class CreateRefreshTokenStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        create() {
            return "valid_refresh_token";
        }
    }
    return new CreateRefreshTokenStub();
};
const makeCreateAccessTokenStub = () => {
    class CreateAccessTokenStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        create(userId) {
            return { accessToken: "valid_refresh_token", expiresIn: 300 };
        }
    }
    return new CreateAccessTokenStub();
};
const makeSut = () => {
    const createRefreshTokenStub = makeCreateRefreshTokenStub();
    const createAccessTokenStub = makeCreateAccessTokenStub();
    const sut = new add_account_repository_1.AddAccountMongoRepository(createRefreshTokenStub, createAccessTokenStub);
    return {
        sut,
        createRefreshTokenStub,
    };
};
describe("AddAccountMongoRepository", () => {
    beforeAll(async () => {
        await mongo_helper_1.mongoHelper.connect();
    });
    afterAll(async () => {
        const accountCollection = mongo_helper_1.mongoHelper.getCollection("account");
        await (await accountCollection).deleteMany({});
        await mongo_helper_1.mongoHelper.disconnect();
    });
    test("should return account if success", async () => {
        const { sut } = makeSut();
        const req = await sut.add({
            email: "valid_mail@mail.com",
            name: "valid_name",
            password: "valid_password",
        });
        expect(req.refreshToken).toBeTruthy();
        expect(req.accessToken).toBeTruthy();
        expect(req.id).toBeTruthy();
        expect(req).toStrictEqual(expect.objectContaining({
            email: "valid_mail@mail.com",
            name: "valid_name",
            password: "valid_password",
        }));
    });
});
