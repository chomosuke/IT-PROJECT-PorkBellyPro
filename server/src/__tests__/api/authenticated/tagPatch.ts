/* eslint-disable no-underscore-dangle */

import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import { IAuthenticatedRouter } from '../../../api/authenticated/router';
import { tagPatch } from '../../../api/authenticated/tagPatch';
import { HttpStatusError } from '../../../api/HttpStatusError';
import { IUser } from '../../../models/user';
import { mock, mockResponse } from '../../helpers';
import { mockRequest } from './helpers';

describe('PATCH /api/tag unit tests', () => {
  test('Success test: full update', async () => {
    expect.assertions(8);

    const userId = {};
    const tagId = '000000000000000000000000';
    const label = 'label';
    const color = 'blue';
    const tag = {
      _id: new ObjectId(tagId),
      label,
      color,
    };
    const router = {
      parent: {
        Tags: {
          findOneAndUpdate: mock().mockResolvedValue(tag),
        },
      },
    } as unknown as IAuthenticatedRouter;
    const req = mockRequest({
      body: {
        id: tagId,
        label,
        color,
      },
      user: {
        _id: userId,
      } as unknown as IUser & Document,
    });
    const res = mockResponse({
      status: mock().mockReturnThis(),
      json: mock().mockReturnThis(),
    });
    const next = mock();

    await expect(tagPatch.implementation.call(router, req, res, next))
      .resolves
      .toBeUndefined();

    expect(router.parent.Tags.findOneAndUpdate).toBeCalledTimes(1);
    expect(router.parent.Tags.findOneAndUpdate).toBeCalledWith(
      {
        _id: new ObjectId(tagId),
        user: userId,
      },
      {
        label,
        color,
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({
      id: new ObjectId(tagId),
      label,
      color,
    });
    expect(next).toBeCalledTimes(0);
  });

  test('Success test: color-only update', async () => {
    expect.assertions(8);

    const userId = {};
    const tagId = '000000000000000000000000';
    const label = 'label';
    const color = 'blue';
    const tag = {
      _id: new ObjectId(tagId),
      label,
      color,
    };
    const router = {
      parent: {
        Tags: {
          findOneAndUpdate: mock().mockResolvedValue(tag),
        },
      },
    } as unknown as IAuthenticatedRouter;
    const req = mockRequest({
      body: {
        id: tagId,
        color,
      },
      user: {
        _id: userId,
      } as unknown as IUser & Document,
    });
    const res = mockResponse({
      status: mock().mockReturnThis(),
      json: mock().mockReturnThis(),
    });
    const next = mock();

    await expect(tagPatch.implementation.call(router, req, res, next))
      .resolves
      .toBeUndefined();

    expect(router.parent.Tags.findOneAndUpdate).toBeCalledTimes(1);
    expect(router.parent.Tags.findOneAndUpdate).toBeCalledWith(
      {
        _id: new ObjectId(tagId),
        user: userId,
      },
      {
        color,
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({
      id: new ObjectId(tagId),
      label,
      color,
    });
    expect(next).toBeCalledTimes(0);
  });

  test('Success test: label-only update', async () => {
    expect.assertions(8);

    const userId = {};
    const tagId = '000000000000000000000000';
    const label = 'label';
    const color = 'blue';
    const tag = {
      _id: new ObjectId(tagId),
      label,
      color,
    };
    const router = {
      parent: {
        Tags: {
          findOneAndUpdate: mock().mockResolvedValue(tag),
        },
      },
    } as unknown as IAuthenticatedRouter;
    const req = mockRequest({
      body: {
        id: tagId,
        label,
      },
      user: {
        _id: userId,
      } as unknown as IUser & Document,
    });
    const res = mockResponse({
      status: mock().mockReturnThis(),
      json: mock().mockReturnThis(),
    });
    const next = mock();

    await expect(tagPatch.implementation.call(router, req, res, next))
      .resolves
      .toBeUndefined();

    expect(router.parent.Tags.findOneAndUpdate).toBeCalledTimes(1);
    expect(router.parent.Tags.findOneAndUpdate).toBeCalledWith(
      {
        _id: new ObjectId(tagId),
        user: userId,
      },
      {
        label,
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({
      id: new ObjectId(tagId),
      label,
      color,
    });
    expect(next).toBeCalledTimes(0);
  });

  test('Fail test: bad color', async () => {
    expect.assertions(3);

    const color = 'lmao';
    const router = {} as IAuthenticatedRouter;
    const req = mockRequest({
      body: {
        id: '000000000000000000000000',
        color,
      },
    });
    const res = mockResponse();
    const next = mock();

    const { rejects } = expect(tagPatch.implementation.call(router, req, res, next));
    await rejects.toBeInstanceOf(HttpStatusError);
    await rejects.toHaveProperty('code', 400);
    expect(next).toBeCalledTimes(0);
  });

  test('Fail test: bad id', async () => {
    expect.assertions(3);

    const router = {} as IAuthenticatedRouter;
    const req = mockRequest({
      body: {
        id: 'lmao',
      },
    });
    const res = mockResponse();
    const next = mock();

    const { rejects } = expect(tagPatch.implementation.call(router, req, res, next));
    await rejects.toBeInstanceOf(HttpStatusError);
    await rejects.toHaveProperty('code', 400);
    expect(next).toBeCalledTimes(0);
  });
});
