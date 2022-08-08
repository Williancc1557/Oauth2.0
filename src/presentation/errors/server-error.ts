export class ServerError extends Error {
  public constructor() {
    super("Internal server error");
    this.name = "ServerError";
  }
}
