import { Response } from 'express';
import { IApiRouter } from '../../api/api-router';
import { helloHandler } from '../../api/hello';
import {
  bindHandler, mock, mockRequest, mockResponse, next, returnSelf,
} from '../helpers';

describe('Hello route tests', () => {
  test('Hello', () => {
    const req = mockRequest();
    const res = mockResponse({
      status: mock<Response['status']>(returnSelf),
      send: mock<Response['send']>(returnSelf),
    });

    const router: Partial<IApiRouter> = {};
    const fn = bindHandler(router, helloHandler);
    fn(req, res, next);

    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith('Hello!');
  });
});
