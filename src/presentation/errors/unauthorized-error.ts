export class UnauthorizedError extends Error {
  public constructor() {
    super("Unauthorized error");
    this.name = "UnauthorizedError";
  }
}
