/* eslint-disable @typescript-eslint/no-magic-numbers */
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 15 minutos
  max: 100, // Limite de solicitações por IP
  message: "Você atingiu o limite de solicitações por IP.",
});
