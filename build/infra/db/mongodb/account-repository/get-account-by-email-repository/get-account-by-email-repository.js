"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAccountByEmailMongoRepository = void 0;
const mongo_helper_1 = require("../../helpers/mongo-helper");
class GetAccountByEmailMongoRepository {
    async get(email) {
        const accountCollection = await mongo_helper_1.mongoHelper.getCollection("account");
        const accountData = await accountCollection.findOne({ email });
        return mongo_helper_1.mongoHelper.map(accountData);
    }
}
exports.GetAccountByEmailMongoRepository = GetAccountByEmailMongoRepository;
