import type { GetRefreshTokenRepository } from "../../../../data/protocols/get-refresh-token-repository";
import type { AccountModel } from "../../../../domain/models/account";
import { mongoHelper } from "../helpers/mongo-helper";

export class GetRefreshTokenMongoRepository
  implements GetRefreshTokenRepository
{
  public async get(refreshToken: string): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection("account");

    const account = await accountCollection.findOne({
      refreshToken,
    });

    return mongoHelper.map(account);
  }
}
