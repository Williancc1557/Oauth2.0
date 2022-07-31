export interface PasswordValidator {
  validate: (password: string) => boolean;
}
