import type {
  CreateAccessToken,
  CreateAccessTokenOutput,
} from "../../data/protocols/create-access-token";
import jwt from "jsonwebtoken";
import env from "../../main/config/env";

export class UtilCreateAccessToken implements CreateAccessToken {
  public create(userId: string): CreateAccessTokenOutput {
    const expiresIn = 300;
    const accessToken = jwt.sign(
      {
        sub: userId,
      },
      env.secretAccessTokenJwt,
      {
        expiresIn,
      }
    );

    return {
      expiresIn,
      accessToken,
    };
  }
}
