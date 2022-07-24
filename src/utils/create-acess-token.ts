import type { CreateAcessToken } from "../presentation/protocols/create-acess-token";
import jwt from "jsonwebtoken";
import env from "../main/config/env";

export class UtilCreateAcessToken implements CreateAcessToken {
  public create(userId: string): string {
    return jwt.sign(
      {
        aud: userId,
        sub: "user",
      },
      env.secretJwt
    );
  }
}
