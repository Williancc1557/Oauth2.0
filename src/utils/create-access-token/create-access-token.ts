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
        aud: userId,
        sub: "user",
      },
      env.secretAccessTokenJwt,
      {
        expiresIn: "300",
      }
    );

    return {
      expiresIn,
      accessToken,
    };
  }
}
