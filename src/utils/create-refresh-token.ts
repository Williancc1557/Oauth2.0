import { uid } from "uid";
import type { CreateRefreshToken } from "../data/protocols";

export class UtilCreateRefreshToken implements CreateRefreshToken {
  public create(): string {
    const LENGTH = 25;
    return uid(LENGTH);
  }
}
