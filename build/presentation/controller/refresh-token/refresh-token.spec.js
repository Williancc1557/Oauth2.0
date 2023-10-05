"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const refresh_token_1 = require("./refresh-token");
const http_helper_1 = require("../../helpers/http-helper");
const errors_1 = require("../../errors");
const makeFakeHttpRequest = () => ({
    header: {
        refreshtoken: "valid_access_token",
    },
});
const makeCheckRefreshTokenStub = () => {
    class CheckRefreshToken {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async check(refreshToken) {
            return "valid_user_id";
        }
    }
    return new CheckRefreshToken();
};
const makeCreateAccessTokenStub = () => {
    class CreateAccessToken {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        create(userId) {
            return {
                accessToken: "valid_access_token",
                expiresIn: 300,
            };
        }
    }
    return new CreateAccessToken();
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
    const checkRefreshTokenStub = makeCheckRefreshTokenStub();
    const createAccessTokenStub = makeCreateAccessTokenStub();
    const validationStub = makeValidationStub();
    const sut = new refresh_token_1.RefreshTokenController(checkRefreshTokenStub, createAccessTokenStub, validationStub);
    return {
        sut,
        checkRefreshTokenStub,
        createAccessTokenStub,
        validationStub,
    };
};
describe("RefreshToken Controller", () => {
    test("should return 500 if checkRefreshToken has any error", async () => {
        const { sut, checkRefreshTokenStub } = makeSut();
        jest
            .spyOn(checkRefreshTokenStub, "check")
            .mockRejectedValueOnce(new Error());
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.serverError)());
    });
    test("should return 500 if createAccessTokenStub has any error", async () => {
        const { sut, createAccessTokenStub } = makeSut();
        jest.spyOn(createAccessTokenStub, "create").mockImplementation(() => {
            throw new Error();
        });
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.serverError)());
    });
    test("should return 400 if checkRefreshToken returns null", async () => {
        const { sut, checkRefreshTokenStub } = makeSut();
        jest.spyOn(checkRefreshTokenStub, "check").mockReturnValueOnce(null);
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.unauthorized)());
    });
    test("should checkRefreshToken is called with correct accessToken", async () => {
        const { sut, checkRefreshTokenStub } = makeSut();
        const checkRefreshTokenSpy = jest.spyOn(checkRefreshTokenStub, "check");
        await sut.handle(makeFakeHttpRequest());
        expect(checkRefreshTokenSpy).toBeCalledWith("valid_access_token");
    });
    test("should create access is called with correct id", async () => {
        const { sut, createAccessTokenStub } = makeSut();
        const createAccessTokenSpy = jest.spyOn(createAccessTokenStub, "create");
        await sut.handle(makeFakeHttpRequest());
        expect(createAccessTokenSpy).toBeCalledWith("valid_user_id");
    });
    test("should return 200 if success", async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.ok)({
            accessToken: "valid_access_token",
            expiresIn: 300,
        }));
    });
    test("should return 400 if validation returns an error", async () => {
        const { sut, validationStub } = makeSut();
        jest
            .spyOn(validationStub, "validate")
            .mockReturnValueOnce(new errors_1.InvalidParamError("refreshtoken"));
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.badRequest)(new errors_1.InvalidParamError("refreshtoken")));
    });
});
