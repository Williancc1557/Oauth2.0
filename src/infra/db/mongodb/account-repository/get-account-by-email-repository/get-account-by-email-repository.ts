import type { GetAccountByEmailRepository } from "../../../../../data/protocols/get-account-by-email-repository";
import type { AccountModel } from "../../../../../domain/models/account";
import { mongoHelper } from "../../helpers/mongo-helper";

export class GetAccountByEmailMongoRepository
  implements GetAccountByEmailRepository
{
  public async get(email: string): Promise<AccountModel | null> {
    const accountCollection = await mongoHelper.getCollection("account");

    const accountData = await accountCollection.findOne({ email });

    return mongoHelper.map(accountData);
  }
}
