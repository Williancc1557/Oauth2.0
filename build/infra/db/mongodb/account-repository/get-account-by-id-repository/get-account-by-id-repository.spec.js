"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_helper_1 = require("../../helpers/mongo-helper");
const get_account_by_id_repository_1 = require("./get-account-by-id-repository");
const makeSut = () => {
    const sut = new get_account_by_id_repository_1.GetAccountByIdMongoRepository();
    return {
        sut,
    };
};
describe("GetAccountByIdMongoRepository", () => {
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
        await mongo_helper_1.mongoHelper.disconnect();
    });
    test("should return account if success", async () => {
        const { sut } = makeSut();
        const req = await sut.get(id);
        expect(req.refreshToken).toBeTruthy();
        expect(req.id).toBeTruthy();
        expect(req.password).toBeTruthy();
        expect(req).toStrictEqual(expect.objectContaining({
            email: "valid_mail@mail.com",
            name: "valid_name",
        }));
    });
});
