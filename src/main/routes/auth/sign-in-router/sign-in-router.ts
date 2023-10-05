import type { Router } from "express";
import { adaptRoute } from "../../../adapters/express-route-adapter";
import { makeSignInController } from "../../../factories/sign-in/sign-in";

export const signInRouter = (router: Router) => {
  router.post("/auth/sign-in", adaptRoute(makeSignInController()));
};
