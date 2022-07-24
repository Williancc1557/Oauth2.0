export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://0.0.0.0:27017/clean-arch-api",
  port: process.env.PORT || 5050, // eslint-disable-line
  secretJwt: process.env.SECRET_JWT || "secret_jwt",
};
