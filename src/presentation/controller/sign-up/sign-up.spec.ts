import type { AccountModel } from "../../../domain/models/account";
import type { GetAccountByEmail } from "../../../domain/usecase/get-account-by-email";
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

const makeGetAccountByEmailStub = () => {
  class GetAccountByEmailStub implements GetAccountByEmail {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async get(email: string): Promise<AccountModel> {
      return {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        refreshToken: "valid_refresh_token",
      };
    }
  }

  return new GetAccountByEmailStub();
};

const makeSut = () => {
  const validateEmailStub = makeValidateEmailStub();
  const getAccountByEmailStub = makeGetAccountByEmailStub();
  const sut = new SignUpController(validateEmailStub, getAccountByEmailStub);

  return {
    sut,
    validateEmailStub,
    getAccountByEmailStub,
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

  test("should validate is called with correct values", async () => {
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

  test("should getAccountByEmail is called with correct values", async () => {
    const { sut, getAccountByEmailStub } = makeSut();

    const getAccountByEmailSpy = jest.spyOn(getAccountByEmailStub, "get");

    const httpRequest = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    await sut.handle({ body: httpRequest });

    expect(getAccountByEmailSpy).toBeCalledWith("valid_email@mail.com");
  });

  test("should returns statusCode 409 if account already exists", async () => {
    const { sut, getAccountByEmailStub } = makeSut();

    jest.spyOn(getAccountByEmailStub, "get").mockResolvedValueOnce({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
      refreshToken: "valid_refresh_token",
    });

    const httpRequest = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.statusCode).toBe(409);
  });
});
