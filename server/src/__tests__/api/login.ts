import { hashSync } from 'bcrypt';
import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { IApiRouter } from '../../api/api-router';
import { HttpStatusError } from '../../api/HttpStatusError';
import { login } from '../../api/login';
import { decryptSession, sessionMaxAge } from '../../api/Session';
import {
  DeepPartial, mock, mockRequest, mockResponse,
} from '../helpers';

describe('login unit tests', () => {
  test('Success test', async () => {
    const id = Types.ObjectId();
    const username = 'a';
    const password = 'b';

    const routerPartial: DeepPartial<IApiRouter> = {
      secretKey: Buffer.alloc(32),
      Users: {
        find: mock().mockResolvedValue([{
          id,
          password: hashSync(password, 10),
        }]),
      },
    };
    const router = routerPartial as IApiRouter;

    const req = mockRequest({
      body: {
        username,
        password,
      },
    });
    const res = mockResponse({
      cookie: mock().mockReturnThis(),
      sendStatus: mock().mockReturnThis(),
    });
    const next = mock<NextFunction>();

    await expect(login.implementation.call(router, req, res, next))
      .resolves.toBeUndefined();

    expect(router.Users.find).toBeCalledTimes(1);
    expect(router.Users.find).toBeCalledWith({ username });
    expect(res.cookie).toBeCalledWith('token', expect.any(String), {
      expires: expect.any(Date),
      httpOnly: true,
      secure: true,
    });
    expect(res.cookie).toBeCalledTimes(1);
    const token = (res.cookie as jest.MockedFunction<typeof res.cookie>).mock.calls[0][1];
    expect(typeof token).toBe('string');
    const session = decryptSession(router.secretKey, token);
    expect(session.userId).toStrictEqual(id);
    expect((session.expires.getTime() - Date.now()) / sessionMaxAge).toBeCloseTo(1);
    expect(res.sendStatus).toBeCalledWith(200);
    expect(res.sendStatus).toBeCalledTimes(1);
  });

  test('Fail test: wrong password', async () => {
    const username = 'a';
    const password = 'b';

    const routerPartial: DeepPartial<IApiRouter> = {
      Users: {
        find: mock().mockResolvedValue([{
          password: hashSync(password, 10),
        }]),
      },
    };
    const router = routerPartial as IApiRouter;

    const req = mockRequest({
      body: {
        username,
        password: 'c',
      },
    });
    const res = mockResponse();
    const next = mock<NextFunction>();

    await expect(login.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(401));

    expect(router.Users.find).toBeCalledTimes(1);
    expect(router.Users.find).toBeCalledWith({ username });
  });

  test('Fail test: no user', async () => {
    const username = 'a';
    const password = 'b';

    const routerPartial: DeepPartial<IApiRouter> = {
      Users: {
        find: mock().mockResolvedValue([]),
      },
    };
    const router = routerPartial as IApiRouter;

    const req = mockRequest({
      body: {
        username,
        password,
      },
    });
    const res = mockResponse();
    const next = mock<NextFunction>();

    await expect(login.implementation.call(router, req, res, next))
      .rejects
      .toStrictEqual(new HttpStatusError(401));

    expect(router.Users.find).toBeCalledTimes(1);
    expect(router.Users.find).toBeCalledWith({ username });
  });

  test('Fail test: bad request', async () => {
    const username = 'a';
    const router = {} as IApiRouter;

    const req = mockRequest({ body: { username } });
    const res = mockResponse();
    const next = mock<NextFunction>();

    await expect(login.implementation.call(router, req, res, next))
      .rejects
      .toStrictEqual(new HttpStatusError(400));
  });
});
