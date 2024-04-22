import type { Router } from "express";
import { adaptRoute } from "../../adapters/express-route-adapter";
import { makeTokenInfoController } from "../../factories/token-info/token-info";

export const tokenInfoRouter = (router: Router) => {
  router.get("/auth/token-info", adaptRoute(makeTokenInfoController()));
};
