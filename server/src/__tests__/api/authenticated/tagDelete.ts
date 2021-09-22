/* eslint-disable no-underscore-dangle */

import { ClientSession, ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import { IAuthenticatedRouter } from '../../../api/authenticated/router';
import { tagDelete } from '../../../api/authenticated/tagDelete';
import { HttpStatusError } from '../../../api/HttpStatusError';
import { IUser } from '../../../models/user';
import { mock, mockResponse } from '../../helpers';
import { mockRequest } from './helpers';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function mockOf<T extends (...args: any[]) => any>(fn: T) {
  return (fn as jest.MockedFunction<T>).mock;
}

describe('DELETE /api/tag unit tests', () => {
  test('Success test', async () => {
    expect.assertions(15);

    const tagId = '000000000000000000000000';
    const session = {
      endSession: mock(),
      withTransaction: mock((fn) => expect(fn()).resolves.toBeUndefined()),
    } as unknown as ClientSession;
    const router = {
      parent: {
        db: {
          startSession: mock().mockResolvedValue(session),
        },
        Cards: {
          updateMany: mock().mockResolvedValue([]),
        },
        Tags: {
          findOneAndDelete: mock().mockResolvedValue({}),
        },
      },
    } as unknown as IAuthenticatedRouter;
    const req = mockRequest({
      body: {
        id: tagId,
      },
      user: {
        _id: new ObjectId('000001000001000001000001'),
      } as IUser & Document,
    });
    const res = mockResponse({
      sendStatus: mock().mockReturnThis(),
    });
    const next = mock();

    await expect(
      tagDelete.implementation.call(router, req, res, next),
    ).resolves.toBeUndefined();

    expect(session.endSession).toBeCalledTimes(1);
    expect(session.endSession).toBeCalledWith();
    expect(session.withTransaction).toBeCalledTimes(1);
    expect(mockOf(session.withTransaction).calls[0][0]).toBeInstanceOf(Function);
    expect(router.parent.db.startSession).toBeCalledTimes(1);
    expect(router.parent.db.startSession).toBeCalledWith();
    expect(router.parent.Cards.updateMany).toBeCalledTimes(1);
    expect(router.parent.Cards.updateMany).toBeCalledWith(
      { user: req.user._id },
      { $pull: { tags: new ObjectId(tagId) } },
    );
    expect(router.parent.Tags.findOneAndDelete).toBeCalledTimes(1);
    expect(router.parent.Tags.findOneAndDelete).toBeCalledWith({
      _id: new ObjectId(tagId),
      user: req.user._id,
    });
    expect(res.sendStatus).toBeCalledTimes(1);
    expect(res.sendStatus).toBeCalledWith(200);
    expect(next).toBeCalledTimes(0);
  });

  test('Fail test: tag not found', async () => {
    expect.assertions(13);

    const tagId = '000000000000000000000000';
    const session = {
      endSession: mock(),
      withTransaction: mock(async (fn) => {
        try {
          await fn();
        } catch (err) {
          expect(err).toBeInstanceOf(HttpStatusError);
          expect(err).toHaveProperty('code', 410);
          throw err;
        }
      }),
    } as unknown as ClientSession;
    const router = {
      parent: {
        db: {
          startSession: mock().mockResolvedValue(session),
        },
        Tags: {
          findOneAndDelete: mock().mockResolvedValue(null),
        },
      },
    } as unknown as IAuthenticatedRouter;
    const req = mockRequest({
      body: {
        id: tagId,
      },
      user: {
        _id: new ObjectId('000001000001000001000001'),
      } as IUser & Document,
    });
    const res = mockResponse();
    const next = mock();

    const { rejects } = expect(
      tagDelete.implementation.call(router, req, res, next),
    );
    await rejects.toBeInstanceOf(HttpStatusError);
    await rejects.toHaveProperty('code', 410);

    expect(session.endSession).toBeCalledTimes(1);
    expect(session.endSession).toBeCalledWith();
    expect(session.withTransaction).toBeCalledTimes(1);
    expect(mockOf(session.withTransaction).calls[0][0]).toBeInstanceOf(Function);
    expect(router.parent.db.startSession).toBeCalledTimes(1);
    expect(router.parent.db.startSession).toBeCalledWith();
    expect(router.parent.Tags.findOneAndDelete).toBeCalledTimes(1);
    expect(router.parent.Tags.findOneAndDelete).toBeCalledWith({
      _id: new ObjectId(tagId),
      user: req.user._id,
    });
    expect(next).toBeCalledTimes(0);
  });
});
