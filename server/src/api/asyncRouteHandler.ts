import type { ApiRequestHandler } from './api-router';

export type AsyncApiRequestHandler = (
  this: ThisParameterType<ApiRequestHandler>,
  ...args: Parameters<ApiRequestHandler>)
=> Promise<ReturnType<ApiRequestHandler>>;

export function asyncRouteHandler(handler: AsyncApiRequestHandler): ApiRequestHandler {
  return function asyncHandler(this, ...args) {
    const next = args[2];
    handler.call(this, ...args).catch((reason) => next(reason));
  };
}
