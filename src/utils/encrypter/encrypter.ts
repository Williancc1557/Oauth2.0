import type { Encrypter } from "../../data/protocols/encrypter";
import bcrypt from "bcrypt";

export class UtilEncrypter implements Encrypter {
  public constructor(private readonly salts: number) {}

  public async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salts);
  }
}
