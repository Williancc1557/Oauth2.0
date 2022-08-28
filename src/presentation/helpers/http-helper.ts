import type { HttpResponse } from "../protocols/http";
import { ServerError } from "../errors/server-error";
import { UnauthorizedError } from "../errors";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: { error: error.message },
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: { error: new ServerError().message },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const conflict = (error: Error): HttpResponse => ({
  statusCode: 409,
  body: { error: error.message },
});

export const unauthorized = (): HttpResponse => ({
  body: { error: new UnauthorizedError().message },
  statusCode: 401,
});
