import cookieParser from 'cookie-parser';
import { RequestHandler, Router, json } from 'express';
import { Query } from 'mongoose';
import type { IApiRouter } from '../api-router';
import { auth } from './auth';
import { cardDelete } from './cardDelete';
import { cardPatch } from './cardPatch';
import { cardPut } from './cardPut';
import { image } from './image';
import { me } from './me';
import { tagPut } from './tagPut';

type QueryResult<Q> =
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  Q extends Query<infer ResultType, infer _DocType, infer _THelpers, infer _RawDocType>
    ? NonNullable<ResultType>
    : never;

export type AuthenticatedRequest = Parameters<RequestHandler>[0] & {
  user: QueryResult<ReturnType<IApiRouter['Users']['findById']>>;
};

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
type Drop<T> = T extends [infer _U, ...infer V] ? V : never;

export type AuthenticatedApiRequestHandler = (
  this: IAuthenticatedRouter,
  req: AuthenticatedRequest,
  ...args: Drop<Parameters<RequestHandler>>)
=> ReturnType<RequestHandler>;

export interface IAuthenticatedRouter {
  get router(): Router;
  get parent(): IApiRouter;
}

export class AuthenticatedRouter implements IAuthenticatedRouter {
  private parentPrivate: IApiRouter;

  private routerPrivate: Router = Router();

  private cookieParser: RequestHandler = cookieParser();

  private authorize: RequestHandler;

  constructor(parent: IApiRouter) {
    this.parentPrivate = parent;
    this.authorize = auth.bind(this.parentPrivate);

    this.routerPrivate.get('/me', this.auth, this.bind(me));
    this.routerPrivate.delete('/card', json(), this.auth, this.bind(cardDelete));
    this.routerPrivate.patch('/card', json({ limit: '1mb' }), this.auth, this.bind(cardPatch));
    this.routerPrivate.put('/card', json({ limit: '1mb' }), this.auth, this.bind(cardPut));
    this.routerPrivate.put('/tag', json(), this.auth, this.bind(tagPut));
    this.routerPrivate.get('/image/:cardId', this.auth, this.bind(image));
  }

  get router(): Router {
    return this.routerPrivate;
  }

  get parent(): IApiRouter {
    return this.parentPrivate;
  }

  private bind(handler: AuthenticatedApiRequestHandler): RequestHandler {
    return handler.bind(this) as RequestHandler;
  }

  private auth: RequestHandler = (req, res, next) => {
    this.cookieParser(req, res, (reason) => {
      if (reason == null) this.authorize(req, res, next);
      else next(reason);
    });
  };
}
