/* eslint-disable no-underscore-dangle */

import { AnyKeys, AnyObject, Document } from 'mongoose';
import { AuthenticatedRequest, IAuthenticatedRouter } from '../../../api/authenticated/router';
import { tagPut } from '../../../api/authenticated/tagPut';
import { HttpStatusError } from '../../../api/HttpStatusError';
import { ITag } from '../../../models/tag';
import { mock, mockResponse } from '../../helpers';
import { mockRequest } from './helpers';

describe('PUT /api/tag unit tests', () => {
  test('Success test', async () => {
    expect.assertions(10);

    const id = {};
    const save = mock();
    const router = {
      parent: {
        Tags: mock(function Tags(
          this: ITag & Document,
          doc?: (AnyKeys<ITag> & AnyObject) | undefined,
        ) {
          this._id = id;
          this.save = save.mockResolvedValue(this);
          if (doc !== undefined) {
            const { user, label, color } = doc;
            this.user = user;
            this.label = label;
            this.color = color;
          }
        }),
      },
    } as unknown as IAuthenticatedRouter;
    const user = {
      _id: {},
    } as AuthenticatedRequest['user'];
    const label = 'label';
    const color = 'blue';
    const req = mockRequest({
      user,
      body: {
        label,
        color,
      },
    });
    const res = mockResponse({
      status: mock().mockReturnThis(),
      json: mock().mockReturnThis(),
    });
    const next = mock();

    await expect(tagPut.implementation.call(router, req, res, next))
      .resolves
      .toBeUndefined();

    expect(router.parent.Tags).toBeCalledTimes(1);
    expect(router.parent.Tags).toBeCalledWith({
      user: user._id,
      label,
      color,
    });
    expect(save).toBeCalledTimes(1);
    expect(save).toBeCalledWith();
    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      id,
      label,
      color,
    });
    expect(res.json).toBeCalledTimes(1);
    expect(next).toBeCalledTimes(0);
  });

  test('Fail test: not a color', async () => {
    expect.assertions(2);

    const router = undefined as unknown as IAuthenticatedRouter;
    const user = {} as AuthenticatedRequest['user'];
    const label = 'label';
    const color = 'lmao';
    const req = mockRequest({
      user,
      body: {
        label,
        color,
      },
    });
    const res = mockResponse({
      sendStatus: mock().mockReturnThis(),
    });
    const next = mock();

    const { rejects } = expect(tagPut.implementation.call(router, req, res, next));

    await rejects.toBeInstanceOf(HttpStatusError);
    await rejects.toHaveProperty('code', 400);
  });
});
