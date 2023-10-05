import type { Express } from "express";
import { Router } from "express";
import { refreshTokenRouter } from "../routes/auth/refresh-token-router/refresh-token-router";
import { signInRouter } from "../routes/auth/sign-in-router/sign-in-router";
import { signUpRouter } from "../routes/auth/sign-up-router/sign-up-router";
import { tokenInfoRouter } from "../routes/auth/token-info-router/token-info-router";

export const setupRoutes = (app: Express) => {
  const router = Router();

  app.use("/api", router);

  refreshTokenRouter(router);
  signInRouter(router);
  signUpRouter(router);
  tokenInfoRouter(router);
};
