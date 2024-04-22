import type { Router } from "express";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { makeVerifyAccessTokenController } from "../../factories/verify-access-token/verify-access-token";

export const verifyAccessTokenRouter = (router: Router) => {
  router.get(
    "/auth/check-token",
    adaptRoute(makeVerifyAccessTokenController())
  );
};
