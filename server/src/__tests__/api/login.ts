import { hashSync } from 'bcrypt';
import { NextFunction } from 'express';
import { Schema } from 'mongoose';
import { IApiRouter } from '../../api/api-router';
import { HttpStatusError } from '../../api/HttpStatusError';
import { login } from '../../api/login';
import {
  DeepPartial, mock, mockRequest, mockResponse,
} from '../helpers';

describe('login unit tests', () => {
  test('Success test', async () => {
    const id = new Schema.Types.ObjectId('0');
    const username = 'a';
    const password = 'b';

    const routerPartial: DeepPartial<IApiRouter> = {
      secretKey: Buffer.alloc(32),
      users: {
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

    expect(router.users.find).toBeCalledTimes(1);
    expect(router.users.find).toBeCalledWith({ username });
    expect(res.cookie).toBeCalledWith('token', expect.any(String), {
      expires: expect.any(Date),
      httpOnly: true,
      secure: true,
    });
    expect(res.cookie).toBeCalledTimes(1);
    expect(res.sendStatus).toBeCalledWith(200);
    expect(res.sendStatus).toBeCalledTimes(1);
  });

  test('Fail test: wrong password', async () => {
    const username = 'a';
    const password = 'b';

    const routerPartial: DeepPartial<IApiRouter> = {
      users: {
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

    expect(router.users.find).toBeCalledTimes(1);
    expect(router.users.find).toBeCalledWith({ username });
  });

  test('Fail test: no user', async () => {
    const username = 'a';
    const password = 'b';

    const routerPartial: DeepPartial<IApiRouter> = {
      users: {
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

    expect(router.users.find).toBeCalledTimes(1);
    expect(router.users.find).toBeCalledWith({ username });
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
