import type { HttpResponse } from '../protocols/http.js';

export const ok = <B>(body: B): HttpResponse<B> => ({
  statusCode: 200,
  body,
});

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  body: error,
});

export const notFound = (error: Error): HttpResponse<Error> => ({
  statusCode: 404,
  body: error,
});

export const serverError = (): HttpResponse<Error> => ({
  statusCode: 500,
  body: new Error('Internal server error'),
});
