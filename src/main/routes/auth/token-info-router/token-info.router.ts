import type { Router } from "express";
import { adaptRoute } from "../../../adapters/express-route-adapter";
import { makeTokenInfoController } from "../../../factories/token-info";

export default (router: Router) => {
  router.get("/auth/token-info", adaptRoute(makeTokenInfoController()));
};
