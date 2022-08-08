import type { Router } from "express";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { makeSignInController } from "../../factories/sign-in";

export default (router: Router) => {
  router.post("/sign-in", adaptRoute(makeSignInController()));
};
