"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const http_helper_1 = require("../../helpers/http-helper");
const sign_up_1 = require("./sign-up");
const makeFakeHttpRequest = () => ({
    body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
    },
});
const makeGetAccountByEmailStub = () => {
    class GetAccountByEmailStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async get(email) {
            return null;
        }
    }
    return new GetAccountByEmailStub();
};
const makeAddAccountStub = () => {
    class AddAccountStub {
        async add(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        account) {
            return {
                id: "valid_id",
                name: "valid_name",
                email: "valid_email@mail.com",
                password: "valid_password",
                refreshToken: "valid_refreshToken",
                accessToken: "valid_accessToken",
                expiresIn: 300,
            };
        }
    }
    return new AddAccountStub();
};
const makeValidationStub = () => {
    class ValidationStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(input) {
            return null;
        }
    }
    return new ValidationStub();
};
const makeSut = () => {
    const getAccountByEmailStub = makeGetAccountByEmailStub();
    const addAccountStub = makeAddAccountStub();
    const validationStub = makeValidationStub();
    const sut = new sign_up_1.SignUpController(getAccountByEmailStub, addAccountStub, validationStub);
    return {
        sut,
        getAccountByEmailStub,
        addAccountStub,
        validationStub,
    };
};
describe("Sign-Up", () => {
    test("should getAccountByEmail is called with correct values", async () => {
        const { sut, getAccountByEmailStub } = makeSut();
        const getAccountByEmailSpy = jest.spyOn(getAccountByEmailStub, "get");
        await sut.handle(makeFakeHttpRequest());
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
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.conflict)(new errors_1.AccountAlreadyExistsError()));
    });
    test("should returns statusCode 500 if getAccountByEmail throws", async () => {
        const { sut, getAccountByEmailStub } = makeSut();
        jest.spyOn(getAccountByEmailStub, "get").mockRejectedValueOnce(Error);
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.serverError)());
    });
    test("should AddAccount is called with correct values", async () => {
        const { sut, addAccountStub } = makeSut();
        const addAccountSpy = jest.spyOn(addAccountStub, "add");
        await sut.handle(makeFakeHttpRequest());
        expect(addAccountSpy).toBeCalledWith({
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_password",
        });
    });
    test("should returns statusCode 500 if addAccount throws", async () => {
        const { sut, addAccountStub } = makeSut();
        jest.spyOn(addAccountStub, "add").mockRejectedValueOnce(Error);
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.serverError)());
    });
    test("should returns statusCode 200 if success", async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.ok)({
            refreshToken: "valid_refreshToken",
            accessToken: "valid_accessToken",
            expiresIn: 300,
        }));
    });
    test("should returns account in the body if success", async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse.body).toStrictEqual({
            refreshToken: "valid_refreshToken",
            accessToken: "valid_accessToken",
            expiresIn: 300,
        });
    });
    test("should return 400 if validation returns an error", async () => {
        const { sut, validationStub } = makeSut();
        jest
            .spyOn(validationStub, "validate")
            .mockReturnValueOnce(new errors_1.InvalidParamError("email"));
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.badRequest)(new errors_1.InvalidParamError("email")));
    });
});
