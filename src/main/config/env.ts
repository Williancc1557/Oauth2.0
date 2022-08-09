export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://0.0.0.0:27017/auth2",
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  port: process.env.PORT || 5050,
  secretRefreshTokenJwt:
    process.env.REFRESH_TOKEN_JWT || "secret_refresh_token_jwt",
  secretAccessTokenJwt: process.env.SECRET_JWT || "secret_jwt",
};
