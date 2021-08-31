import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { CardDeleteRequest } from '@porkbellypro/crm-shared';
import { IAuthenticatedRouter } from '../../../api/authenticated/router';
import {
  DeepPartial, mock, mockResponse, mockStartSession,
} from '../../helpers';
import { mockRequest } from './helpers';
import { User } from './auth';
import { cardDelete } from '../../../api/authenticated/cardDelete';
import { HttpStatusError } from '../../../api/HttpStatusError';

const user = {
  id: Types.ObjectId().toString(),
} as User;

const user1 = {
  id: Types.ObjectId().toString(),
} as User;

const existingCardsConsts = [{
  id: Types.ObjectId().toString(),
  user: Types.ObjectId(user.id),
  favorite: true,
  name: 'Bill Nye',
  phone: '0123456789',
  email: 'thescienceguy@pbs.org',
  jobTitle: 'Science Guy',
  company: 'PBS',
  // image: undefined,
  fields: [{ key: 'coolness', value: 'very' }],
  tags: [],
},
{
  id: Types.ObjectId().toString(),
  user: Types.ObjectId(user1.id),
  favorite: false,
  name: 'Prince Charming',
  phone: '0123456789',
  email: 'noFace@face.clear',
  jobTitle: 'Clean Shaven',
  company: 'FaceClear',
  image: Buffer.from('bad image', 'base64'),
  fields: [],
  tags: [],
}];

let existingCards: typeof existingCardsConsts;

// mock the router
const mockCardDelete = mock();
const mockCardFind = mock((id) => existingCards.find((c) => c.id === id));
const routerPartial: DeepPartial<IAuthenticatedRouter> = {
  parent: {
    db: {
      startSession: mockStartSession,
    },
    Cards: {
      findById: mockCardFind,
      findByIdAndDelete: mockCardDelete,
    },
  },
};

const router = routerPartial as IAuthenticatedRouter;

const next = mock<NextFunction>();

describe('DELETE /api/card unit tests', () => {
  beforeEach(() => {
    existingCards = existingCardsConsts.map((card) => ({ ...card }));
    mockCardFind.mockClear();
    mockCardDelete.mockClear();
  });

  test('Success case: deletion of card', async () => {
    const request: CardDeleteRequest = {
      id: existingCards[0].id,
    };

    const req = mockRequest({
      body: request,
      user,
    });

    const res = mockResponse({
      sendStatus: mock().mockReturnThis(),
    });

    await expect(cardDelete.implementation.call(router, req, res, next))
      .resolves.toBeUndefined();

    expect(mockCardFind).toBeCalledTimes(1);
    expect(mockCardFind).toBeCalledWith(existingCards[0].id);
    expect(mockCardDelete).toBeCalledTimes(1);
    expect(res.sendStatus).toBeCalledTimes(1);
    expect(res.sendStatus).toBeCalledWith(204);
  });

  test('Failure case: malformed request', async () => {
    const request = {
      id: 12,
    };

    const req = mockRequest({
      body: request,
      user,
    });

    const res = mockResponse({
      sendStatus: mock().mockReturnThis(),
    });

    await expect(cardDelete.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(400));

    expect(mockCardFind).toBeCalledTimes(0);
    expect(mockCardDelete).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledTimes(0);
  });

  test('Failure case: card those not exist', async () => {
    const request = {
      id: existingCards[0].id,
    };

    // removes card from 'database'
    existingCards.splice(0);

    const req = mockRequest({
      body: request,
      user,
    });

    const res = mockResponse({
      sendStatus: mock().mockReturnThis(),
    });

    await expect(cardDelete.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(410));

    expect(mockCardFind).toBeCalledTimes(1);
    expect(mockCardFind).toBeCalledWith(request.id);
    expect(mockCardDelete).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledTimes(0);
  });

  test('Failure case: card is not belonging to user', async () => {
    const request = {
      id: existingCards[1].id,
    };

    // wrong person. card 1 belongs to user1
    const req = mockRequest({
      body: request,
      user,
    });

    const res = mockResponse({
      sendStatus: mock().mockReturnThis(),
    });

    await expect(cardDelete.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(401));

    expect(mockCardFind).toBeCalledTimes(1);
    expect(mockCardFind).toBeCalledWith(existingCards[1].id);
    expect(mockCardDelete).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledTimes(0);
  });
});
