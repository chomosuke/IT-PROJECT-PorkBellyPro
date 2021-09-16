/* eslint-disable no-underscore-dangle */
import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { image } from '../../../api/authenticated/image';
import { IAuthenticatedRouter } from '../../../api/authenticated/router';
import { HttpStatusError } from '../../../api/HttpStatusError';
import { DeepPartial, mock, mockResponse } from '../../helpers';
import { User } from './auth';
import { mockRequest } from './helpers';

describe('/api/image unit tests', () => {
  test('Success test', async () => {
    const imageData = 'someBuffer';
    const imageHash = 'someHash';

    const req = mockRequest({
      params: {
        imageHash,
      },
      user: {
        _id: Types.ObjectId(),
      } as User,
    });

    const res = mockResponse({
      contentType: mock(),
      end: mock(),
      removeHeader: mock(),
    });

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {
      parent: {
        Cards: {
          find: mock().mockResolvedValue([{
            image: imageData,
            user: req.user._id,
          }]),
        },
      },
    };
    const router = routerPartial as IAuthenticatedRouter;

    const next = mock<NextFunction>();

    await expect(image.implementation.call(router, req, res, next))
      .resolves.toBeUndefined();

    expect(router.parent.Cards.find).toBeCalledTimes(1);
    expect(router.parent.Cards.find).toBeCalledWith({ user: req.user._id, imageHash });

    expect(res.contentType).toBeCalledTimes(1);
    expect(res.contentType).toBeCalledWith('image/jpeg');

    expect(res.end).toBeCalledTimes(1);
    expect(res.end).toBeCalledWith(imageData);

    expect(res.removeHeader).toBeCalledTimes(1);
    expect(res.removeHeader).toBeCalledWith('Cache-Control');
  });

  test('Fail test: no card', async () => {
    const req = mockRequest({
      params: {
        imageHash: 'someHash',
      },
      user: {
        id: Types.ObjectId().toString(),
      } as User,
    });

    const res = mockResponse();

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {
      parent: {
        Cards: {
          find: mock().mockResolvedValue([]),
        },
      },
    };
    const router = routerPartial as IAuthenticatedRouter;

    const next = mock<NextFunction>();

    await expect(image.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(404));
  });
});
