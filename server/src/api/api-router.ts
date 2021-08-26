import { RequestHandler, Router } from 'express';
import { Connection, Model } from 'mongoose';
import { helloHandler } from './hello';
import { IUser, userSchema } from '../models/user';
import { ICard, cardSchema } from '../models/card';

export interface IApiRouter {
  get db(): Connection;
  get router(): Router;
  get users(): Model<IUser>;
  get Cards(): Model<ICard>;
}

export type ApiRequestHandler
  = (this: IApiRouter, ...params: Parameters<RequestHandler>) => ReturnType<RequestHandler>;

export class ApiRouter implements IApiRouter {
  private dbPrivate: Connection;

  private routerPrivate: Router = Router();

  private usersPrivate: Model<IUser>;

  private cardPrivate: Model<ICard>;

  constructor(db: Connection) {
    this.dbPrivate = db;
    this.routerPrivate.get('/hello', this.bind(helloHandler));

    this.usersPrivate = db.model<IUser>('User', userSchema);
    this.cardPrivate = db.model<ICard>('Card', cardSchema);
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
