import { ObjectId } from "mongodb";
import type { GetAccountByIdRepository } from "../../../../data/protocols/get-account-by-id-repository";
import type { AccountModel } from "../../../../domain/models/account";
import { mongoHelper } from "../helpers/mongo-helper";

export class GetAccountByIdMongoRepository implements GetAccountByIdRepository {
  public async get(accountId: string): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection("account");

    const accountData = await accountCollection.findOne({
      _id: new ObjectId(accountId),
    });

    return mongoHelper.map(accountData);
  }
}
