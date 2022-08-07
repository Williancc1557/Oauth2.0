import { ObjectId } from "mongodb";
import type {
  AcessTokenType,
  AddAccountRepository,
} from "../../../../../data/protocols/add-account-repository";
import type { AccountModel } from "../../../../../domain/models/account";
import type { AddAccountInput } from "../../../../../domain/usecase/add-account";
import type { CreateAcessToken } from "../../../../../data/protocols/create-acess-token";
import type { CreateRefreshToken } from "../../../../../data/protocols/create-refresh-token";
import { mongoHelper } from "../../helpers/mongo-helper";

export class AddAccountMongoRepository implements AddAccountRepository {
  public constructor(
    private readonly createRefreshToken: CreateRefreshToken,
    private readonly createAcessToken: CreateAcessToken
  ) {}

  public async add(
    account: AddAccountInput
  ): Promise<AccountModel & AcessTokenType> {
    const accountCollection = await mongoHelper.getCollection("account");
    const { insertedId } = await accountCollection.insertOne(account);

    const refreshToken = this.createRefreshToken.create(String(insertedId.id));

    await accountCollection.updateOne(
      { _id: new ObjectId(insertedId) },
      { $set: { refreshToken } }
    );

    const accountData = await accountCollection.findOne(
      new ObjectId(insertedId)
    );

    const acessToken = this.createAcessToken.create(String(accountData._id));

    return mongoHelper.map(Object.assign(accountData, { acessToken }));
  }
}
