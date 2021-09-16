import { NextFunction, Response } from 'express';
import { Types } from 'mongoose';
import { me } from '../../../api/authenticated/me';
import { IAuthenticatedRouter } from '../../../api/authenticated/router';
import { DeepPartial, mock, mockResponse } from '../../helpers';
import { mockRequest } from './helpers';

describe('/api/me unit tests', () => {
  test('Success test', async () => {
    const id = '000000000000000000000000';
    const findCards = mock().mockResolvedValue([{
      id,
      favorite: true,
      name: 'name',
      phone: 'phone',
      email: 'email',
      jobTitle: 'jobTitle',
      company: 'company',
      image: Buffer.alloc(0),
      imageHash: 'someHash',
      fields: [{
        key: 'Field 1',
        value: 'Value 1',
      },
      {
        key: 'Field 2',
        value: 'Value 2',
      }],
      tags: [
        Types.ObjectId('000000000000000000000001'), Types.ObjectId('000000000000000000000002'),
      ],
    }]);
    const findTags = mock().mockResolvedValue([{
      id: '000000000000000000000001',
      label: 'Tag 1',
      color: '#000001',
    },
    {
      id: '000000000000000000000002',
      label: 'Tag 2',
      color: '#000002',
    }]);
    const withTransaction = mock((callback) => callback());
    const endSession = mock();
    const startSession = mock().mockResolvedValue({
      withTransaction,
      endSession,
    });

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {
      parent: {
        Cards: {
          find: findCards,
        },
        Tags: {
          find: findTags,
        },
        db: {
          startSession,
        },
      },
    };
    const router = routerPartial as IAuthenticatedRouter;
    const username = 'username';
    const req = mockRequest({
      user: {
        id,
        username,
      } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    });
    const status = mock<Response['status']>().mockReturnThis();
    const json = mock<Response['json']>().mockReturnThis();
    const res = mockResponse({
      status,
      json,
    });
    const next = mock<NextFunction>();
    await me.implementation.call(router, req, res, next);

    expect(startSession).toBeCalledWith();
    expect(startSession).toBeCalledTimes(1);
    expect(withTransaction).toBeCalledTimes(1);
    expect(findCards).toBeCalledWith({ user: id });
    expect(findTags).toBeCalledWith({ user: id });
    expect(endSession).toBeCalledWith();
    expect(endSession).toBeCalledTimes(1);
    expect(status).toBeCalledWith(200);
    expect(status).toBeCalledTimes(1);
    expect(json).toBeCalledTimes(1);
    expect(json.mock.calls[0][0]).toStrictEqual({
      username,
      settings: {},
      cards: [{
        id,
        favorite: true,
        name: 'name',
        phone: 'phone',
        email: 'email',
        jobTitle: 'jobTitle',
        company: 'company',
        imageHash: 'someHash',
        fields: [{
          key: 'Field 1',
          value: 'Value 1',
        },
        {
          key: 'Field 2',
          value: 'Value 2',
        }],
        tags: [
          '000000000000000000000001', '000000000000000000000002',
        ],
      }],
      tags: [{
        id: '000000000000000000000001',
        label: 'Tag 1',
        color: '#000001',
      },
      {
        id: '000000000000000000000002',
        label: 'Tag 2',
        color: '#000002',
      }],
    });
  });
});
