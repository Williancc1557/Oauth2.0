import type { CreateAccessToken } from "../../data/protocols/create-access-token";
import jwt from "jsonwebtoken";
import env from "../../main/config/env";

export class UtilCreateAccessToken implements CreateAccessToken {
  public create(userId: string): string {
    return jwt.sign(
      {
        aud: userId,
        sub: "user",
      },
      env.secretAccessTokenJwt,
      {
        expiresIn: "5m",
      }
    );
  }
}
