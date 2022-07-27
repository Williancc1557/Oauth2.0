import type { AccountModel } from "../../../domain/models/account";
import type {
  AddAccount,
  AddAccountInput,
} from "../../../domain/usecase/add-account";
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
    public async get(email: string): Promise<AccountModel | null> {
      return null;
    }
  }

  return new GetAccountByEmailStub();
};

const makeAddAccountStub = () => {
  class AddAccountStub implements AddAccount {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async add(account: AddAccountInput): Promise<AccountModel> {
      return {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        refreshToken: "valid_refreshToken",
      };
    }
  }

  return new AddAccountStub();
};

const makeSut = () => {
  const validateEmailStub = makeValidateEmailStub();
  const getAccountByEmailStub = makeGetAccountByEmailStub();
  const addAccountStub = makeAddAccountStub();
  const sut = new SignUpController(
    validateEmailStub,
    getAccountByEmailStub,
    addAccountStub
  );

  return {
    sut,
    validateEmailStub,
    getAccountByEmailStub,
    addAccountStub,
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

    jest.spyOn(getAccountByEmailStub, "get").mockResolvedValue({
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

  test("should returns statusCode 500 if getAccountByEmail throws", async () => {
    const { sut, getAccountByEmailStub } = makeSut();

    jest.spyOn(getAccountByEmailStub, "get").mockImplementation(() => {
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

  test("should returns statusCode 400 if success", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.statusCode).toBe(200);
  });

  test("should returns account in the body if success", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const req = await sut.handle({ body: httpRequest });

    expect(req.body).toStrictEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
      refreshToken: "valid_refreshToken",
    });
  });
});
