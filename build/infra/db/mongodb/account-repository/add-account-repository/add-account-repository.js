"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAccountMongoRepository = void 0;
const mongodb_1 = require("mongodb");
const mongo_helper_1 = require("../../helpers/mongo-helper");
class AddAccountMongoRepository {
    constructor(createRefreshToken, createAccessToken) {
        this.createRefreshToken = createRefreshToken;
        this.createAccessToken = createAccessToken;
    }
    async add(account) {
        const accountCollection = await mongo_helper_1.mongoHelper.getCollection("account");
        const { insertedId } = await accountCollection.insertOne(account);
        const refreshToken = this.createRefreshToken.create();
        await accountCollection.updateOne({ _id: new mongodb_1.ObjectId(insertedId) }, { $set: { refreshToken } });
        const accountData = await accountCollection.findOne(new mongodb_1.ObjectId(insertedId));
        const accessToken = this.createAccessToken.create(String(accountData._id));
        return mongo_helper_1.mongoHelper.map(Object.assign(accountData, accessToken));
    }
}
exports.AddAccountMongoRepository = AddAccountMongoRepository;
