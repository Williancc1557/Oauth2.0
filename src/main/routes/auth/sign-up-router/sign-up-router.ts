import type { Router } from "express";
import { adaptRoute } from "../../../adapters/express-route-adapter";
import { makeSignUpController } from "../../../factories/sign-up/sign-up";

export default (router: Router) => {
  router.post("/auth/sign-up", adaptRoute(makeSignUpController()));
};
