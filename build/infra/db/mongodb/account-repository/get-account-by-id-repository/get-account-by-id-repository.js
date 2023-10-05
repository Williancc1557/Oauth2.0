"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAccountByIdMongoRepository = void 0;
const mongodb_1 = require("mongodb");
const mongo_helper_1 = require("../../helpers/mongo-helper");
class GetAccountByIdMongoRepository {
    async get(accountId) {
        const accountCollection = await mongo_helper_1.mongoHelper.getCollection("account");
        const accountData = await accountCollection.findOne({
            _id: new mongodb_1.ObjectId(accountId),
        });
        return mongo_helper_1.mongoHelper.map(accountData);
    }
}
exports.GetAccountByIdMongoRepository = GetAccountByIdMongoRepository;
