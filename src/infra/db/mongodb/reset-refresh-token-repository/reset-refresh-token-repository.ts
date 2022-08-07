import { ObjectId } from "mongodb";
import type { CreateRefreshToken } from "../../../../data/protocols/create-refresh-token";
import type { ResetRefreshTokenRepository } from "../../../../data/protocols/reset-refresh-token-repository";
import { mongoHelper } from "../helpers/mongo-helper";

export class ResetRefreshTokenMongoRepository
  implements ResetRefreshTokenRepository
{
  public constructor(private readonly createRefreshToken: CreateRefreshToken) {}

  public async reset(userId: string): Promise<string> {
    const accountCollection = await mongoHelper.getCollection("account");
    const newRefreshToken = this.createRefreshToken.create(userId);

    await accountCollection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: { refreshToken: newRefreshToken },
      }
    );

    return newRefreshToken;
  }
}
