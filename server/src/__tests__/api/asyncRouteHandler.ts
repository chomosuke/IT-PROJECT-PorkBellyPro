import { NextFunction } from 'express';
import { asyncRouteHandler } from '../../api/asyncRouteHandler';
import { mock, mockRequest, mockResponse } from '../helpers';

import type { IApiRouter } from '../../api/api-router';

describe('asyncRouteHandler tests', () => {
  test('Await test', (done) => {
    const wait = () => new Promise((resolve) => setTimeout(resolve));
    const handler = asyncRouteHandler(async () => {
      await wait();
      done();
    });
    handler.call({} as IApiRouter, mockRequest(), mockResponse(), mock<NextFunction>());
  });

  test('Catch test', (done) => {
    expect.assertions(1);
    const error = new Error();
    const wait = () => new Promise((_resolve, reject) => setTimeout(reject, 0, error));
    const handler = asyncRouteHandler(async () => {
      await wait();
    });
    const next = mock<NextFunction>((err) => {
      expect(err).toBe(error);
      done();
    });
    handler.call({} as IApiRouter, mockRequest(), mockResponse(), next);
  });
});
