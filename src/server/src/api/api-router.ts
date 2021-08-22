import { Router, RequestHandler } from 'express';
import { helloHandler } from './hello';

export type ApiRequestHandler
  = (this: ApiRouter, ...params: Parameters<RequestHandler>) => ReturnType<RequestHandler>;

export class ApiRouter {
  private routerPrivate: Router = Router();

  constructor() {
    this.routerPrivate.get('/hello', this.bind(helloHandler));
  }

  get router() {
    return this.routerPrivate;
  }

  private bind(handler: ApiRequestHandler): RequestHandler {
    return handler.bind(this);
  }
}
