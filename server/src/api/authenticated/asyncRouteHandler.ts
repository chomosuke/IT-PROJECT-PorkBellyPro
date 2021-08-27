import type { AuthenticatedApiRequestHandler } from './router';

export type AsyncAuthenticatedApiRequestHandler = (
  this: ThisParameterType<AuthenticatedApiRequestHandler>,
  ...args: Parameters<AuthenticatedApiRequestHandler>)
=> Promise<ReturnType<AuthenticatedApiRequestHandler>>;

export type AuthenticatedApiRequestHandlerAsync = AuthenticatedApiRequestHandler & {
  implementation: AsyncAuthenticatedApiRequestHandler;
};

export function asyncRouteHandler(
  handler: AsyncAuthenticatedApiRequestHandler,
): AuthenticatedApiRequestHandlerAsync {
  const asyncHandler: AuthenticatedApiRequestHandlerAsync = function asyncHandler(this, ...args) {
    const next = args[2];
    handler.call(this, ...args).catch((reason) => next(reason));
  };
  asyncHandler.implementation = handler;
  return asyncHandler;
}
