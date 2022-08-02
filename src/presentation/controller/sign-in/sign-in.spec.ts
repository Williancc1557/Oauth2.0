import type { PasswordValidator } from "../../protocols/password-validator";
import type { RequiredParams } from "../../protocols/required-params";
import type { ValidateEmail } from "../../protocols/validate-email";
import { SignInController } from "./sign-in";

const makeValidateEmailStub = () => {
  class ValidateEmailStub implements ValidateEmail {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(email: string): boolean {
      return true;
    }
  }

  return new ValidateEmailStub();
};

const makePasswordValidatorStub = () => {
  class PasswordValidatorStub implements PasswordValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(password: string): boolean {
      return true;
    }
  }

  return new PasswordValidatorStub();
};

const makeRequiredParams = () => {
  class RequiredParamsStub implements RequiredParams {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public check(requiredParams: Array<string>, body: any): string {
      return;
    }
  }

  return new RequiredParamsStub();
};

const makeSut = () => {
  const validateEmailStub = makeValidateEmailStub();
  const passwordValidatorStub = makePasswordValidatorStub();
  const requiredParamsStub = makeRequiredParams();

  const sut = new SignInController(
    validateEmailStub,
    passwordValidatorStub,
    requiredParamsStub
  );

  return {
    sut,
    validateEmailStub,
    passwordValidatorStub,
    requiredParamsStub,
  };
};

describe("SignIn Controller", () => {
  test("should return statusCode 400 if password is not provided", async () => {
    const { sut, requiredParamsStub } = makeSut();

    jest.spyOn(requiredParamsStub, "check").mockReturnValueOnce("email");

    const httpRequest = {
      body: {},
    };

    const res = await sut.handle(httpRequest);

    expect(res.statusCode).toBe(400);
  });
});
