import { randomBytes } from 'crypto';
import { NextFunction } from 'express-serve-static-core';
import { Query, Types } from 'mongoose';
import { IApiRouter } from '../../../api/api-router';
import { auth } from '../../../api/authenticated/auth';
import { AuthenticatedRequest } from '../../../api/authenticated/router';
import { HttpStatusError } from '../../../api/HttpStatusError';
import { Session, encryptSession, sessionMaxAge } from '../../../api/Session';
import {
  DeepPartial, mock, mockRequest, mockResponse,
} from '../../helpers';

type QueryResult<Q> =
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  Q extends Query<infer ResultType, infer _DocType, infer _THelpers, infer _RawDocType>
    ? ResultType
    : never;

type User = NonNullable<QueryResult<ReturnType<IApiRouter['Users']['findById']>>>;

describe('auth tests', () => {
  test('Success test', async () => {
    const mockUser = {} as User;
    const secretKey = randomBytes(32);
    const routerPartial: DeepPartial<IApiRouter> = {
      secretKey,
      Users: {
        findById: mock().mockResolvedValue(mockUser),
      },
    };
    const router = routerPartial as IApiRouter;
    const session: Session = {
      userId: Types.ObjectId(randomBytes(12).toString('hex')),
      expires: new Date(Date.now() + sessionMaxAge),
    };
    const req = mockRequest({
      cookies: {
        token: encryptSession(secretKey, session),
      },
    }) as AuthenticatedRequest;
    const res = mockResponse();
    const next = mock<NextFunction>();

    await auth.implementation.call(router, req, res, next);

    expect(router.Users.findById).toBeCalledTimes(1);
    expect(router.Users.findById).toBeCalledWith(session.userId);
    expect(req.user).toBe(mockUser);
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith();
  });

  test('Fail test: expired session', async () => {
    const secretKey = randomBytes(32);
    const routerPartial: DeepPartial<IApiRouter> = {
      secretKey,
    };
    const router = routerPartial as IApiRouter;
    const session: Session = {
      userId: Types.ObjectId(randomBytes(12).toString('hex')),
      expires: new Date(Date.now() - 1),
    };
    const req = mockRequest({
      cookies: {
        token: encryptSession(secretKey, session),
      },
    }) as AuthenticatedRequest;
    const res = mockResponse();
    const next = mock<NextFunction>();

    await expect(auth.implementation.call(router, req, res, next))
      .rejects
      .toStrictEqual(new HttpStatusError(401));
    expect(next).toBeCalledTimes(0);
  });

  test('Fail test: bad token', async () => {
    const secretKey = randomBytes(32);
    const routerPartial: DeepPartial<IApiRouter> = {
      secretKey,
    };
    const router = routerPartial as IApiRouter;
    const req = mockRequest({
      cookies: {
        token: randomBytes(128),
      },
    }) as AuthenticatedRequest;
    const res = mockResponse();
    const next = mock<NextFunction>();

    await expect(auth.implementation.call(router, req, res, next))
      .rejects
      .toStrictEqual(new HttpStatusError(401));
    expect(next).toBeCalledTimes(0);
  });

  test('Fail test: no token', async () => {
    const router = {} as IApiRouter;
    const req = mockRequest({
      cookies: {},
    }) as AuthenticatedRequest;
    const res = mockResponse();
    const next = mock<NextFunction>();

    await expect(auth.implementation.call(router, req, res, next))
      .rejects
      .toStrictEqual(new HttpStatusError(401));
    expect(next).toBeCalledTimes(0);
  });
});
