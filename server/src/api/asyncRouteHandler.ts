import type { ApiRequestHandler } from './api-router';

export type AsyncApiRequestHandler = (
  this: ThisParameterType<ApiRequestHandler>,
  ...args: Parameters<ApiRequestHandler>)
=> Promise<ReturnType<ApiRequestHandler>>;

export type ApiRequestHandlerAsync = ApiRequestHandler & {
  implementation: AsyncApiRequestHandler;
};

export function asyncRouteHandler(handler: AsyncApiRequestHandler): ApiRequestHandlerAsync {
  const asyncHandler: ApiRequestHandlerAsync = function asyncHandler(this, ...args) {
    const next = args[2];
    handler.call(this, ...args).catch((reason) => next(reason));
  };
  asyncHandler.implementation = handler;
  return asyncHandler;
}
