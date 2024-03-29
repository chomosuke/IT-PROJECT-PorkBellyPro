import { RequestHandler, Router, json } from 'express';
import { Connection, Model } from 'mongoose';
import { AuthenticatedRouter, IAuthenticatedRouter } from './authenticated/router';
import { login } from './login';
import { logout } from './logout';
import { IUser, userSchema } from '../models/user';
import { ICard, cardSchema } from '../models/card';
import { ITag, tagSchema } from '../models/tag';
import { register } from './register';

export interface IApiRouter {
  get secretKey(): Readonly<Buffer>;
  get db(): Connection;
  get router(): Router;
  get Users(): Model<IUser>;
  get Cards(): Model<ICard>;
  get Tags(): Model<ITag>;
}

export type ApiRequestHandler
  = (this: IApiRouter, ...params: Parameters<RequestHandler>) => ReturnType<RequestHandler>;

const noStore: () => RequestHandler = () => ((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

export class ApiRouter implements IApiRouter {
  private secret: Readonly<Buffer>;

  private dbPrivate: Connection;

  private routerPrivate: Router = Router();

  private authRouter: IAuthenticatedRouter = new AuthenticatedRouter(this);

  private usersPrivate: Model<IUser>;

  private cardsPrivate: Model<ICard>;

  private tagsPrivate: Model<ITag>;

  constructor(secret: Readonly<Buffer>, db: Connection) {
    this.secret = Buffer.alloc(secret.length, secret);
    this.dbPrivate = db;

    const jsonMiddleware = json();
    this.routerPrivate.use(noStore());
    this.routerPrivate.post('/logout', logout);
    this.routerPrivate.post('/login', jsonMiddleware, this.bind(login));
    // handle register request
    this.routerPrivate.post('/register', jsonMiddleware, this.bind(register));
    this.routerPrivate.use(this.authRouter.router);

    this.usersPrivate = db.model<IUser>('User', userSchema);
    this.cardsPrivate = db.model<ICard>('Card', cardSchema);
    this.tagsPrivate = db.model<ITag>('Tag', tagSchema);
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

  get Users(): Model<IUser> {
    return this.usersPrivate;
  }

  get Cards(): Model<ICard> {
    return this.cardsPrivate;
  }

  get Tags(): Model<ITag> {
    return this.tagsPrivate;
  }

  private bind(handler: ApiRequestHandler): RequestHandler {
    return handler.bind(this);
  }
}
