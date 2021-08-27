import cookieParser from 'cookie-parser';
import { RequestHandler, Router, json } from 'express';
import { Connection, Model } from 'mongoose';
import { login } from './login';
import { auth } from './auth';
import { AuthenticatedRouter, IAuthenticatedRouter } from './authenticated/router';
import { IUser, userSchema } from '../models/user';

export interface IApiRouter {
  get secretKey(): Readonly<Buffer>;
  get db(): Connection;
  get router(): Router;
  get users(): Model<IUser>;
}

export type ApiRequestHandler
  = (this: IApiRouter, ...params: Parameters<RequestHandler>) => ReturnType<RequestHandler>;

export class ApiRouter implements IApiRouter {
  private secret: Readonly<Buffer>;

  private dbPrivate: Connection;

  private routerPrivate: Router = Router();

  private authRouter: IAuthenticatedRouter = new AuthenticatedRouter(this);

  private usersPrivate: Model<IUser>;

  constructor(secret: Readonly<Buffer>, db: Connection) {
    this.secret = Buffer.alloc(secret.length, secret);
    this.dbPrivate = db;

    const jsonMiddleware = json();
    this.routerPrivate.post('/login', jsonMiddleware, this.bind(login));

    const cookieParserMiddleware = cookieParser();
    this.routerPrivate.use(cookieParserMiddleware, this.bind(auth), this.authRouter.router);

    this.usersPrivate = db.model<IUser>('User', userSchema);
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

  private bind(handler: ApiRequestHandler): RequestHandler {
    return handler.bind(this);
  }
}
