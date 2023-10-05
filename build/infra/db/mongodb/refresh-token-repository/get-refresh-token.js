"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRefreshTokenMongoRepository = void 0;
const mongo_helper_1 = require("../helpers/mongo-helper");
class GetRefreshTokenMongoRepository {
    async get(refreshToken) {
        const accountCollection = await mongo_helper_1.mongoHelper.getCollection("account");
        const account = await accountCollection.findOne({
            refreshToken,
        });
        if (!account) {
            return;
        }
        return mongo_helper_1.mongoHelper.map(account);
    }
}
exports.GetRefreshTokenMongoRepository = GetRefreshTokenMongoRepository;
