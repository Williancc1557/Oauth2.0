export class AccountAlreadyExistsError extends Error {
  public constructor() {
    super("User already exists");
    this.name = "AccountAlreadyExistsError";
  }
}
