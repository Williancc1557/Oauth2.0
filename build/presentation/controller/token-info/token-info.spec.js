"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const http_helper_1 = require("../../helpers/http-helper");
const token_info_1 = require("./token-info");
const makeFakeHttpRequest = () => ({
    header: {
        accesstoken: "valid_access_token",
    },
});
const makeValidationStub = () => {
    class ValidationStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(input) {
            return null;
        }
    }
    return new ValidationStub();
};
const makeVerifyAccessTokenStub = () => {
    class VerifyAccessTokenStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        verify(accesstoken) {
            return true;
        }
    }
    return new VerifyAccessTokenStub();
};
const makeGetTokenInfoStub = () => {
    class GetTokenInfoStub {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        get(token) {
            return {
                accountId: "valid_id",
                exp: 12345,
                iat: 12345,
            };
        }
    }
    return new GetTokenInfoStub();
};
const makeSut = () => {
    const getTokenInfoStub = makeGetTokenInfoStub();
    const verifyAccessTokenStub = makeVerifyAccessTokenStub();
    const validationStub = makeValidationStub();
    const sut = new token_info_1.TokenInfoController(getTokenInfoStub, verifyAccessTokenStub, validationStub);
    return {
        sut,
        getTokenInfoStub,
        verifyAccessTokenStub,
        validationStub,
    };
};
describe("TokenInfo controller", () => {
    test("should return statusCode 400 if accessToken is not valid", async () => {
        const { sut, verifyAccessTokenStub } = makeSut();
        jest.spyOn(verifyAccessTokenStub, "verify").mockReturnValueOnce(false);
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.unauthorized)());
    });
    test("should call getTokenInfo with valid values", async () => {
        const { sut, getTokenInfoStub } = makeSut();
        const getTokenInfoSpy = jest.spyOn(getTokenInfoStub, "get");
        await sut.handle(makeFakeHttpRequest());
        expect(getTokenInfoSpy).toBeCalledWith("valid_access_token");
    });
    test("should return statusCode 500 if GetTokenInfo dependency throws", async () => {
        const { sut, getTokenInfoStub } = makeSut();
        jest.spyOn(getTokenInfoStub, "get").mockImplementation(() => {
            throw new Error();
        });
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.serverError)());
    });
    test("should return statusCode 200 and valid body if success", async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeHttpRequest());
        expect(httpResponse).toStrictEqual((0, http_helper_1.ok)({
            accountId: "valid_id",
            exp: 12345,
            iat: 12345,
        }));
    });
    test("should call Validation with valid values", async () => {
        const { sut, validationStub } = makeSut();
        const validateSpy = jest.spyOn(validationStub, "validate");
        await sut.handle(makeFakeHttpRequest());
        expect(validateSpy).toBeCalledWith(makeFakeHttpRequest().header);
    });
    test("should return 400 if Validation returns an error", async () => {
        const { sut, validationStub } = makeSut();
        jest
            .spyOn(validationStub, "validate")
            .mockReturnValueOnce(new errors_1.MissingParamError("email"));
        const httpRequest = await sut.handle(makeFakeHttpRequest());
        expect(httpRequest).toStrictEqual((0, http_helper_1.badRequest)(new errors_1.MissingParamError("email")));
    });
});
