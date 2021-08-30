import { NextFunction, Response } from 'express';
import { logout } from '../../api/logout';
import { mock, mockRequest, mockResponse } from '../helpers';

describe('/api/logout unit tests', () => {
  test('Success test', () => {
    const req = mockRequest({});
    const clearCookie = mock<Response['clearCookie']>().mockReturnThis();
    const sendStatus = mock<Response['sendStatus']>().mockReturnThis();
    const res = mockResponse({
      clearCookie,
      sendStatus,
    });
    const next = mock<NextFunction>();

    expect(logout(req, res, next)).toBeUndefined();

    expect(clearCookie).toBeCalledWith('token', { httpOnly: true, secure: true });
    expect(clearCookie).toBeCalledTimes(1);
    expect(sendStatus).toBeCalledWith(200);
    expect(sendStatus).toBeCalledTimes(1);
    expect(next).not.toBeCalled();
  });
});
