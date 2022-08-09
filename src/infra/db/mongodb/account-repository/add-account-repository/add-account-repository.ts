import { ObjectId } from "mongodb";
import type {
  AccessTokenType,
  AddAccountRepository,
} from "../../../../../data/protocols/add-account-repository";
import type { AccountModel } from "../../../../../domain/models/account";
import type { AddAccountInput } from "../../../../../domain/usecase/add-account";
import type { CreateAccessToken } from "../../../../../data/protocols/create-access-token";
import type { CreateRefreshToken } from "../../../../../data/protocols/create-refresh-token";
import { mongoHelper } from "../../helpers/mongo-helper";

export class AddAccountMongoRepository implements AddAccountRepository {
  public constructor(
    private readonly createRefreshToken: CreateRefreshToken,
    private readonly createAccessToken: CreateAccessToken
  ) {}

  public async add(
    account: AddAccountInput
  ): Promise<AccessTokenType & AccountModel> {
    const accountCollection = await mongoHelper.getCollection("account");
    const { insertedId } = await accountCollection.insertOne(account);

    const refreshToken = this.createRefreshToken.create();

    await accountCollection.updateOne(
      { _id: new ObjectId(insertedId) },
      { $set: { refreshToken } }
    );

    const accountData = await accountCollection.findOne(
      new ObjectId(insertedId)
    );

    const accessToken = this.createAccessToken.create(String(accountData._id));

    return mongoHelper.map(Object.assign(accountData, { accessToken }));
  }
}
