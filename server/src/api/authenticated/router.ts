import { RequestHandler, Router } from 'express';
import { Query } from 'mongoose';
import type { IApiRouter } from '../api-router';

type QueryResult<Q> =
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  Q extends Query<infer ResultType, infer _DocType, infer _THelpers, infer _RawDocType>
    ? ResultType
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

  constructor(parent: IApiRouter) {
    this.parentPrivate = parent;
  }

  get router(): Router {
    return this.routerPrivate;
  }

  get parent(): IApiRouter {
    return this.parentPrivate;
  }
}
