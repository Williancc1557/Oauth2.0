import type { Router } from "express";
import { adaptRoute } from "../../../adapters/express-route-adapter";
import { makeRefreshTokenController } from "../../../factories/refresh-token/refresh-token";

export const refreshTokenRouter = (router: Router) => {
  router.get("/auth/refresh-token", adaptRoute(makeRefreshTokenController()));
};
