import { config } from "dotenv";

config();

export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://0.0.0.0:27017/auth2",
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  port: process.env.PORT || 8080,
  secretAccessTokenJwt: process.env.SECRET_JWT || "secret_jwt",
};
