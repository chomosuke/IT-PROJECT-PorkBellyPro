import cookieParser from 'cookie-parser';
import { RequestHandler, Router, json } from 'express';
import { Query } from 'mongoose';
import type { IApiRouter } from '../api-router';
import { auth } from './auth';
import { cardPut } from './cardPut';
import { image } from './image';

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

    const jsonMiddleware = json();
    this.routerPrivate.put('/card', jsonMiddleware, this.auth, this.bind(cardPut));
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
