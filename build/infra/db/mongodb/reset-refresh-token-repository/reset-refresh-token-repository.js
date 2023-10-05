"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetRefreshTokenMongoRepository = void 0;
const mongodb_1 = require("mongodb");
const mongo_helper_1 = require("../helpers/mongo-helper");
class ResetRefreshTokenMongoRepository {
    constructor(createRefreshToken) {
        this.createRefreshToken = createRefreshToken;
    }
    async reset(userId) {
        const accountCollection = await mongo_helper_1.mongoHelper.getCollection("account");
        const newRefreshToken = this.createRefreshToken.create();
        await accountCollection.updateOne({
            _id: new mongodb_1.ObjectId(userId),
        }, {
            $set: { refreshToken: newRefreshToken },
        });
        return newRefreshToken;
    }
}
exports.ResetRefreshTokenMongoRepository = ResetRefreshTokenMongoRepository;
