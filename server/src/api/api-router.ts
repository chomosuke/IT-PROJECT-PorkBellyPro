import { RequestHandler, Router } from 'express';
import { Connection, Model } from 'mongoose';
import { helloHandler } from './hello';
import { IUser, userSchema } from '../models/user';
import { ICard, cardSchema } from '../models/card';
import { ITag, tagSchema } from '../models/tag';

export interface IApiRouter {
  get db(): Connection;
  get router(): Router;
  get Users(): Model<IUser>;
  get Cards(): Model<ICard>;
  get Tags(): Model<ITag>;
}

export type ApiRequestHandler
  = (this: IApiRouter, ...params: Parameters<RequestHandler>) => ReturnType<RequestHandler>;

export class ApiRouter implements IApiRouter {
  private dbPrivate: Connection;

  private routerPrivate: Router = Router();

  private usersPrivate: Model<IUser>;

  private cardsPrivate: Model<ICard>;

  private tagsPrivate: Model<ITag>;

  constructor(db: Connection) {
    this.dbPrivate = db;
    this.routerPrivate.get('/hello', this.bind(helloHandler));

    this.usersPrivate = db.model<IUser>('User', userSchema);
    this.cardsPrivate = db.model<ICard>('Card', cardSchema);
    this.tagsPrivate = db.model<ITag>('Tag', tagSchema);
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
