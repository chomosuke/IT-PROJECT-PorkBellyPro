import { Document } from 'mongoose';
import { AuthenticatedRequest, IAuthenticatedRouter } from '../../../api/authenticated/router';
import { tagPut } from '../../../api/authenticated/tagPut';
import { HttpStatusError } from '../../../api/HttpStatusError';
import { ITag } from '../../../models/tag';
import { mock, mockResponse } from '../../helpers';
import { mockRequest } from './helpers';

describe('PUT /api/tag unit tests', () => {
  test('Success test', async () => {
    expect.assertions(8);

    const save = mock();
    const router = {
      parent: {
        Tags: mock(function Tags(this: ITag & Document) {
          this.save = save.mockResolvedValue(this);
        }),
      },
    } as unknown as IAuthenticatedRouter;
    const user = {} as AuthenticatedRequest['user'];
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
      sendStatus: mock().mockReturnThis(),
    });
    const next = mock();

    await expect(tagPut.implementation.call(router, req, res, next))
      .resolves
      .toBeUndefined();

    expect(router.parent.Tags).toBeCalledTimes(1);
    expect(router.parent.Tags).toBeCalledWith({
      user,
      label,
      color,
    });
    expect(save).toBeCalledTimes(1);
    expect(save).toBeCalledWith();
    expect(res.sendStatus).toBeCalledTimes(1);
    expect(res.sendStatus).toBeCalledWith(201);
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
