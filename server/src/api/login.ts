import { compare } from 'bcrypt';
import { CookieOptions } from 'express';
import { asyncRouteHandler } from './asyncRouteHandler';
import { HttpStatusError } from './HttpStatusError';
import { Session, encryptSession, sessionMaxAge } from './Session';

const { NODE_ENV } = process.env;
const isTest = NODE_ENV === 'test';

export const tokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: !isTest || undefined,
};

export const login = asyncRouteHandler(async function login({ body }, res) {
  if (body != null) {
    const { username, password } = body;
    if (typeof username === 'string' && typeof password === 'string') {
      const users = await this.Users.find({ username });
      if (users.length === 1) {
        const [user] = users;
        if (await compare(password, user.password)) {
          const expires = new Date(Date.now() + sessionMaxAge);
          const session: Session = {
            userId: user.id,
            expires,
          };
          const token = encryptSession(this.secretKey, session);
          res.cookie('token', token, {
            expires,
            ...tokenCookieOptions,
          }).sendStatus(200);

          return;
        }
      }

      throw new HttpStatusError(401);
    }
  }

  throw new HttpStatusError(400);
});
