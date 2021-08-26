import { RequestHandler, Router } from 'express';
import { Connection } from 'mongoose';
import { helloHandler } from './hello';

export interface IApiRouter {
  get db(): Connection;
  get router(): Router;
}

export type ApiRequestHandler
  = (this: IApiRouter, ...params: Parameters<RequestHandler>) => ReturnType<RequestHandler>;

export class ApiRouter implements IApiRouter {
  private dbPrivate: Connection;

  private routerPrivate: Router = Router();

  constructor(db: Connection) {
    this.dbPrivate = db;
    this.routerPrivate.get('/hello', this.bind(helloHandler));
  }

  get db(): Connection {
    return this.dbPrivate;
  }

  get router(): Router {
    return this.routerPrivate;
  }

  private bind(handler: ApiRequestHandler): RequestHandler {
    return handler.bind(this);
  }
}
