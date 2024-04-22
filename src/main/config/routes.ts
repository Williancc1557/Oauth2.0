import type { Express } from "express";
import { Router } from "express";
import { refreshTokenRouter } from "../routes/auth/refresh-token-router";
import { signInRouter } from "../routes/auth/sign-in-router";
import { signUpRouter } from "../routes/auth/sign-up-router";
import { tokenInfoRouter } from "../routes/auth/token-info-router";
import { verifyAccessTokenRouter } from "../routes/auth/verify-access-token-router";

export const setupRoutes = (app: Express) => {
  const router = Router();

  app.use("/api", router);

  refreshTokenRouter(router);
  signInRouter(router);
  signUpRouter(router);
  tokenInfoRouter(router);
  verifyAccessTokenRouter(router);
};
