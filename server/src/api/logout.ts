import { RequestHandler } from 'express';
import { tokenCookieOptions } from './login';

export const logout: RequestHandler = function logout(_req, res) {
  res.clearCookie('token', tokenCookieOptions).sendStatus(200);
};
