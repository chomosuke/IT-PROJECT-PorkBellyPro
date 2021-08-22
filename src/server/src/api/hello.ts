import type { ApiRequestHandler } from './api-router';

export const helloHandler: ApiRequestHandler = function helloHandler(_req, res) {
  res.status(200).send('Hello!');
};
