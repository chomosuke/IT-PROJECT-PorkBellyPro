import type { ApiRequestHandler } from './api-router';
import { asyncRouteHandler } from './asyncRouteHandler';
import { AuthenticatedRequest } from './authenticated/router';
import { HttpStatusError } from './HttpStatusError';
import { decryptSession } from './Session';

export const auth: ApiRequestHandler = asyncRouteHandler(async function auth(req, _res, next) {
  try {
    if (req.cookies && typeof req.cookies.token === 'string') {
      const { token } = req.cookies;
      const session = decryptSession(this.secretKey, token);
      if (session.expires.getTime() - Date.now() > 0) {
        const user = await this.users.findById(session.userId);
        if (user != null) {
          (req as AuthenticatedRequest).user = user;
          next();
          return;
        }
      }
    }
  } catch {
    throw new HttpStatusError(401);
  }
});
