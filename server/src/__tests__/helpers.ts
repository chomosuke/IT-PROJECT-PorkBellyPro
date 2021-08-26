import { Request, Response } from 'express';
import { ApiRequestHandler, IApiRouter } from '../api/api-router';

export function bindHandler(
  router: Partial<IApiRouter>, handler: ApiRequestHandler,
): OmitThisParameter<ApiRequestHandler> {
  return handler.bind(router as IApiRouter);
}

export function mockRequest(props?: Partial<Request>): Request {
  return (props ?? {}) as Request;
}

export function mockResponse(props?: Partial<Response>): Response {
  return (props ?? {}) as Response;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function mock<Fn extends (...args: any) => any>(implementation?: Fn)
  : jest.MockedFunction<Fn> {
  return jest.fn(implementation) as unknown as jest.MockedFunction<Fn>;
}

export function returnSelf<T>(this: T): T {
  return this;
}

export function next(): void { }

export type DeepPartial<T> = { [k in keyof T]?: DeepPartial<T[k]>; };
