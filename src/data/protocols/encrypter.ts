export interface Encrypter {
  hash: (value: string) => Promise<string>;
}
