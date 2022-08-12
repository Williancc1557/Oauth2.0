import jwt from "jsonwebtoken";
import type {
  GetTokenInfo,
  GetTokenInfoOutput,
} from "../../presentation/protocols/get-token-info";

export class UtilGetTokenInfo implements GetTokenInfo {
  public get(token: string): GetTokenInfoOutput {
    const jwtInfo = jwt.decode(token);
    return jwtInfo as GetTokenInfoOutput;
  }
}
