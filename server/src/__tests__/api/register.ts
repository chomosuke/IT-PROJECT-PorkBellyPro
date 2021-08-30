import { compareSync, hashSync } from 'bcrypt';
import { NextFunction } from 'express';
import { register } from '../../api/register';
import { HttpStatusError } from '../../api/HttpStatusError';
import { IApiRouter } from '../../api/api-router';
import {
  DeepPartial, mock, mockRequest, mockResponse, mockStartSession,
} from '../helpers';
import { IUser } from '../../models/user';

describe('register unit tests', () => {
  test('register successful', async () => {
    // simulate string username + hashed password
    const username = 'someUsername';
    const password = hashSync('somePassword', 10);

    // simulate 0 existed user in the database
    const routerPartial: DeepPartial<IApiRouter> = {
      db: {
        startSession: mockStartSession,
      },
      Users: {
        find: mock().mockResolvedValue([]),
        create: mock().mockResolvedValue([]),
      },
    };
    const router = routerPartial as IApiRouter;

    // create a mock request
    const req = mockRequest({
      body: {
        username,
        password,
      },
    });

    // create a mock respond
    const res = mockResponse({
      sendStatus: mock(),
    });
    const next = mock<NextFunction>();
    // begin testing
    await expect(register.implementation.call(router, req, res, next))
      .resolves.toBeUndefined();

    // check existing user
    expect(router.Users.find).toBeCalledTimes(1);
    expect(router.Users.find).toBeCalledWith({ username });
    // expect 201 respond, successfully created
    expect(res.sendStatus).toBeCalledWith(201);
    expect(res.sendStatus).toBeCalledTimes(1);
    // check whether a new user is created in the db
    expect(router.Users.create).toBeCalledTimes(1);

    const firstParameter = (
      router.Users.create as jest.MockedFunction<typeof router.Users.create>
    ).mock.calls[0][0] as IUser;
    expect(compareSync(password, firstParameter.password)).toBeTruthy();
    expect(firstParameter.username).toBe(username);
  });

  test('register failed, user already existed', async () => {
    // simulate string username + hashed password
    const username = 'someUsername';
    const password = hashSync('somePassword', 10);

    // simulate 1 existed user with the same username
    const routerPartial: DeepPartial<IApiRouter> = {
      db: {
        startSession: mockStartSession,
      },
      Users: {
        find: mock().mockResolvedValue([{
          username,
          password: hashSync('a', 10),
        }]),
      },
    };
    const router = routerPartial as IApiRouter;

    // create a mock request
    const req = mockRequest({
      body: {
        username,
        password,
      },
    });

    // create a mock respond
    const res = mockResponse();
    const next = mock<NextFunction>();
    // begin testing
    await expect(register.implementation.call(router, req, res, next))
    // error conflict
      .rejects.toStrictEqual(new HttpStatusError(409));
    // check existing user
    expect(router.Users.find).toBeCalledTimes(1);
    expect(router.Users.find).toBeCalledWith({ username });
  });

  test('register failed, bad request', async () => {
    // simulate string username
    const username = 'someUsername';

    // simulate 0 existed user in the database
    const routerPartial: DeepPartial<IApiRouter> = {
      Users: {
        find: mock().mockResolvedValue([]),
      },
    };
    const router = routerPartial as IApiRouter;

    // create a mock request body with no password field
    const req = mockRequest({
      body: {
        username,
      },
    });

    // create a mock respond
    const res = mockResponse();
    const next = mock<NextFunction>();
    // begin testing
    await expect(register.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(400));
  });
});
