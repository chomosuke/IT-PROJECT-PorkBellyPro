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
    const cardId = Types.ObjectId();

    const req = mockRequest({
      params: {
        cardId: cardId.toString(),
      },
      user: {
        id: Types.ObjectId().toString(),
      } as User,
    });

    const res = mockResponse({
      contentType: mock(),
      end: mock(),
    });

    const imageData = 'someBuffer';

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {
      parent: {
        Cards: {
          findById: mock().mockResolvedValue({
            image: imageData,
            user: Types.ObjectId(req.user.id),
          }),
        },
      },
    };
    const router = routerPartial as IAuthenticatedRouter;

    const next = mock<NextFunction>();

    await expect(image.implementation.call(router, req, res, next))
      .resolves.toBeUndefined();

    expect(router.parent.Cards.findById).toBeCalledTimes(1);
    expect(router.parent.Cards.findById).toBeCalledWith(cardId.toString());

    expect(res.contentType).toBeCalledTimes(1);
    expect(res.contentType).toBeCalledWith('image/jpeg');

    expect(res.end).toBeCalledTimes(1);
    expect(res.end).toBeCalledWith(imageData);
  });

  test('Fail test: no card', async () => {
    const cardId = Types.ObjectId();

    const req = mockRequest({
      params: {
        cardId: cardId.toString(),
      },
      user: {
        id: Types.ObjectId().toString(),
      } as User,
    });

    const res = mockResponse();

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {
      parent: {
        Cards: {
          findById: mock().mockResolvedValue(null),
        },
      },
    };
    const router = routerPartial as IAuthenticatedRouter;

    const next = mock<NextFunction>();

    await expect(image.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(404));
  });

  test('Fail test: no image', async () => {
    const cardId = Types.ObjectId();

    const req = mockRequest({
      params: {
        cardId: cardId.toString(),
      },
      user: {
        id: Types.ObjectId().toString(),
      } as User,
    });

    const res = mockResponse();

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {
      parent: {
        Cards: {
          findById: mock().mockResolvedValue({
            user: Types.ObjectId(req.user.id),
          }),
        },
      },
    };
    const router = routerPartial as IAuthenticatedRouter;

    const next = mock<NextFunction>();

    await expect(image.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(404));
  });

  test('Fail test: wrong user', async () => {
    const cardId = Types.ObjectId();

    const req = mockRequest({
      params: {
        cardId: cardId.toString(),
      },
      user: {
        id: Types.ObjectId().toString(),
      } as User,
    });

    const res = mockResponse();

    const imageData = 'someBuffer';

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {
      parent: {
        Cards: {
          findById: mock().mockResolvedValue({
            image: imageData,
            user: Types.ObjectId(),
          }),
        },
      },
    };
    const router = routerPartial as IAuthenticatedRouter;

    const next = mock<NextFunction>();

    await expect(image.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(401));
  });
});
