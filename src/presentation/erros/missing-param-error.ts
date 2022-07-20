export class MissingParamError extends Error {
  public constructor(paramName: string) {
    super(`Missing param: ${paramName}`);
    this.name = "MissingParamError";
  }
}
