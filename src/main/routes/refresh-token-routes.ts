import type { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeRefreshTokenController } from "../factories/refresh-token";

export default (router: Router) => {
  router.post("/refresh-token", adaptRoute(makeRefreshTokenController()));
};
