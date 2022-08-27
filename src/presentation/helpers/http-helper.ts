import type { HttpResponse } from "../protocols/http";
import { ServerError } from "../errors/server-error";
import { UnauthorizedError } from "../errors";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const conflict = (error: Error): HttpResponse => ({
  statusCode: 409,
  body: error,
});

export const unauthorized = (): HttpResponse => ({
  body: new UnauthorizedError(),
  statusCode: 401,
});
