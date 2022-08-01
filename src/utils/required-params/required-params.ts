import type { RequiredParams } from "../../presentation/protocols/required-params";

export class UtilRequiredParams implements RequiredParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public check(requiredParams: Array<string>, body: any): string {
    for (const param of requiredParams) {
      if (!body[param]) {
        return param;
      }
    }
  }
}
