import cookieParser from 'cookie-parser';
import { RequestHandler, Router, json } from 'express';
import { Connection, Model } from 'mongoose';
import { login } from './login';
import { auth } from './auth';
import { AuthenticatedRouter, IAuthenticatedRouter } from './authenticated/router';
import { IUser, userSchema } from '../models/user';
import { ICard, cardSchema } from '../models/card';

export interface IApiRouter {
  get secretKey(): Readonly<Buffer>;
  get db(): Connection;
  get router(): Router;
  get users(): Model<IUser>;
  get Cards(): Model<ICard>;
}

export type ApiRequestHandler
  = (this: IApiRouter, ...params: Parameters<RequestHandler>) => ReturnType<RequestHandler>;

export class ApiRouter implements IApiRouter {
  private secret: Readonly<Buffer>;

  private dbPrivate: Connection;

  private routerPrivate: Router = Router();

  private authRouter: IAuthenticatedRouter = new AuthenticatedRouter(this);

  private usersPrivate: Model<IUser>;

  private cardPrivate: Model<ICard>;

  constructor(secret: Readonly<Buffer>, db: Connection) {
    this.secret = Buffer.alloc(secret.length, secret);
    this.dbPrivate = db;

    const jsonMiddleware = json();
    this.routerPrivate.post('/login', jsonMiddleware, this.bind(login));

    const cookieParserMiddleware = cookieParser();
    this.routerPrivate.use(cookieParserMiddleware, this.bind(auth), this.authRouter.router);

    this.usersPrivate = db.model<IUser>('User', userSchema);
    this.cardPrivate = db.model<ICard>('Card', cardSchema);
  }

  get secretKey(): Readonly<Buffer> {
    return this.secret;
  }

  get db(): Connection {
    return this.dbPrivate;
  }

  get router(): Router {
    return this.routerPrivate;
  }

  get users(): Model<IUser> {
    return this.usersPrivate;
  }

  get Cards(): Model<ICard> {
    return this.cardPrivate;
  }

  private bind(handler: ApiRequestHandler): RequestHandler {
    return handler.bind(this);
  }
}
