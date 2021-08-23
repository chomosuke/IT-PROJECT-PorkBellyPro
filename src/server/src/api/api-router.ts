import { Router, RequestHandler } from 'express';
import { Connection } from 'mongoose';
import { helloHandler } from './hello';

export type ApiRequestHandler
  = (this: ApiRouter, ...params: Parameters<RequestHandler>) => ReturnType<RequestHandler>;

export class ApiRouter {
  private dbPrivate: Connection;

  private routerPrivate: Router = Router();

  constructor(db: Connection) {
    this.dbPrivate = db;
    this.routerPrivate.get('/hello', this.bind(helloHandler));
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
