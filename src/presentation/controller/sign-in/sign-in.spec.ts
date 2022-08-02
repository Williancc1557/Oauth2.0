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

  test("should validateEmail is called with correct values", async () => {
    const { sut, validateEmailStub } = makeSut();

    const validateEmailSpy = jest.spyOn(validateEmailStub, "validate");

    const httpRequest = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    await sut.handle({ body: httpRequest });

    expect(validateEmailSpy).toBeCalledWith("valid_email@mail.com");
  });

  test("should returns statusCode 400 if validateEmail returns false", async () => {
    const { sut, validateEmailStub } = makeSut();

    jest.spyOn(validateEmailStub, "validate").mockReturnValueOnce(false);

    const httpRequest = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.statusCode).toBe(400);
  });

  test("should returns statusCode 500 if validateEmail throws", async () => {
    const { sut, validateEmailStub } = makeSut();

    jest.spyOn(validateEmailStub, "validate").mockImplementation(() => {
      throw new Error();
    });

    const httpRequest = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.statusCode).toBe(500);
  });

  test("should passwordValidator is called with correct values", async () => {
    const { sut, passwordValidatorStub } = makeSut();

    const nameValidatorSpy = jest.spyOn(passwordValidatorStub, "validate");

    const httpRequest = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    await sut.handle({ body: httpRequest });

    expect(nameValidatorSpy).toBeCalledWith("valid_password");
  });

  test("should SignUp returns statusCode 400 if passwordValidator return false", async () => {
    const { sut, passwordValidatorStub } = makeSut();

    jest.spyOn(passwordValidatorStub, "validate").mockReturnValueOnce(false);

    const httpRequest = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.statusCode).toBe(400);
  });
});
