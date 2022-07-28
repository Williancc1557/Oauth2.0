import { ObjectId } from "mongodb";
import type { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import type { AccountModel } from "../../../../domain/models/account";
import type { AddAccountInput } from "../../../../domain/usecase/add-account";
import type { CreateAcessToken } from "../../../../presentation/protocols/create-acess-token";
import { mongoHelper } from "../helpers/mongo-helper";

export class AddAccountMongoRepository implements AddAccountRepository {
    public constructor(
        private readonly createAcessToken: CreateAcessToken
    ) { }

    public async add(account: AddAccountInput): Promise<AccountModel> {
        const accountCollection = await mongoHelper.getCollection("account");

        const { insertedId } = await accountCollection.insertOne(account);

        const accountData = await accountCollection.findOne(new ObjectId(insertedId));

        return mongoHelper.map(accountData);
    }
}