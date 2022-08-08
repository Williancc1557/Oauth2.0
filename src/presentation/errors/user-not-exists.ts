export class UserNotExistsError extends Error {
  public constructor() {
    super("User not exists error");
    this.name = "UserNotExistsError";
  }
}
