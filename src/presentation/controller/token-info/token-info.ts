import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  RequiredParams,
} from "../../protocols";

export class TokenInfoController implements Controller {
  public constructor(private readonly requiredParams: RequiredParams) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredParam = this.requiredParams.check(
      ["refreshToken", "accessToken"],
      httpRequest.body
    );

    if (requiredParam) {
      return badRequest(new MissingParamError(requiredParam));
    }

    return {
      body: null,
      statusCode: 200,
    };
  }
}
