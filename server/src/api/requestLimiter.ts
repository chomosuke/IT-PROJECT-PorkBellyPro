import { RequestHandler } from 'express';
import { HttpStatusError } from './HttpStatusError';

export function requestLimiter(): RequestHandler {
  /* eslint-disable-next-line @typescript-eslint/no-shadow */
  return function requestLimiter(req, _res, next) {
    const length = req.get('Content-Length');

    if (length != null && Number(length) > 1048576) {
      next(new HttpStatusError(413));
      return;
    }

    next();
  };
}
