import jwt from "jsonwebtoken";
import env from "../main/config/env";

export class UtilCreateRefreshToken {
  public create(userId: string): string {
    return jwt.sign(
      {
        aud: userId,
        sub: "user",
      },
      env.secretJwt,
    );
  }
}
