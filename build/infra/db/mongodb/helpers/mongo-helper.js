"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoHelper = void 0;
const mongodb_1 = require("mongodb");
exports.mongoHelper = {
    client: null,
    async connect(url) {
        this.client = await new mongodb_1.MongoClient(url || process.env.MONGO_URL).connect();
    },
    async disconnect() {
        await this.client.close();
        this.client = null;
    },
    dbCollection() {
        return;
    },
    async getCollection(name) {
        try {
            return this.client.db().collection(name);
        }
        catch {
            await this.connect();
            return this.client.db().collection(name);
        }
    },
    // eslint-disable-next-line
    map(account) {
        try {
            const { _id, ...accountWithoudId } = account;
            return {
                ...accountWithoudId,
                id: _id.toString(),
            };
        }
        catch {
            return null;
        }
    },
};
