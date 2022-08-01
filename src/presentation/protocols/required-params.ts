export interface RequiredParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  check: (requiredParams: Array<string>, body: any) => boolean;
}
