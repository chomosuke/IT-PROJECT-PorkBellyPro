import { Router, RequestHandler } from 'express';
import { Connection, Model } from 'mongoose';
import { helloHandler } from './hello';

import { IUser, userSchema } from '../models/user';

export type ApiRequestHandler
  = (this: ApiRouter, ...params: Parameters<RequestHandler>) => ReturnType<RequestHandler>;

export class ApiRouter {
  private dbPrivate: Connection;

  private routerPrivate: Router = Router();

  private userModel : Model<IUser>;

  constructor(db: Connection) {
    this.dbPrivate = db;
    this.routerPrivate.get('/hello', this.bind(helloHandler));

    this.userModel = db.model<IUser>('User', userSchema);
  }

  get db(): Connection {
    return this.dbPrivate;
  }

  get router() {
    return this.routerPrivate;
  }

  private bind(handler: ApiRequestHandler): RequestHandler {
    return handler.bind(this);
  }
}
