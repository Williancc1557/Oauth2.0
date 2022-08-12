import type { VerifyAccessToken } from "../../presentation/protocols/verify-access-token";
import jwt from "jsonwebtoken";
import env from "../../main/config/env";

export class UtilVerifyAccessToken implements VerifyAccessToken {
  public verify(accessToken: string): boolean {
    try {
      jwt.verify(accessToken, env.secretAccessTokenJwt);
      return true;
    } catch (err) {
      return false;
    }
  }
}
