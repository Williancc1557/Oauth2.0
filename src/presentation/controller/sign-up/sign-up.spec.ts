import type { ValidateEmail } from "../../protocols/validate-email";
import { SignUpController } from "./sign-up";

const makeValidateEmailStub = () => {
  class ValidateEmailStub implements ValidateEmail {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public validate(email: string): boolean {
      return true;
    }
  }

  return new ValidateEmailStub();
};

const makeSut = () => {
  const validateEmailStub = makeValidateEmailStub();
  const sut = new SignUpController(validateEmailStub);

  return {
    sut,
    validateEmailStub,
  };
};

describe("Sign-Up", () => {
  test("should returns statusCode 400 if name is not provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.statusCode).toBe(400);
  });

  test("should returns statusCode 400 if email is not provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      name: "valid_name",
      password: "valid_password",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.statusCode).toBe(400);
  });

  test("should returns statusCode 400 if password is not provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      name: "valid_name",
      email: "valid_email@mail.com",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.statusCode).toBe(400);
  });

  test("should returns statusCode 400 if email is not called with correct values", async () => {
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

  test("should returns statusCode 400 if email is not valid", async () => {
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
});
