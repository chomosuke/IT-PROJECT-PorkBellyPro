/* eslint-disable no-underscore-dangle */
import { NextFunction } from 'express';
import { mongo } from 'mongoose';
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
  _id: new mongo.ObjectId(),
} as User;

const user1 = {
  _id: new mongo.ObjectId(),
} as User;

const existingCardsConsts = [{
  _id: new mongo.ObjectId(),
  user: new mongo.ObjectId(user._id),
  favorite: true,
  name: 'Bill Nye',
  phone: '0123456789',
  email: 'thescienceguy@pbs.org',
  jobTitle: 'Science Guy',
  company: 'PBS',
  // image: undefined,
  fields: [{ key: 'coolness', value: 'very' }],
  tags: [],
  remove: jest.fn(),
},
{
  _id: new mongo.ObjectId(),
  user: new mongo.ObjectId(user1._id),
  favorite: false,
  name: 'Prince Charming',
  phone: '0123456789',
  email: 'noFace@face.clear',
  jobTitle: 'Clean Shaven',
  company: 'FaceClear',
  image: Buffer.from('bad image', 'base64'),
  fields: [],
  tags: [],
  remove: jest.fn(),
}];

let existingCards: typeof existingCardsConsts;

// mock the router
const mockCardFind = mock((id) => existingCards.find((c) => id.equals(c._id)));
const routerPartial: DeepPartial<IAuthenticatedRouter> = {
  parent: {
    db: {
      startSession: mockStartSession,
    },
    Cards: {
      findById: mockCardFind,
    },
  },
};

const router = routerPartial as IAuthenticatedRouter;

const next = mock<NextFunction>();

describe('DELETE /api/card unit tests', () => {
  beforeEach(() => {
    existingCardsConsts.forEach((c) => c.remove.mockClear());
    existingCards = existingCardsConsts.map((card) => ({ ...card }));
    mockCardFind.mockClear();
  });

  test('Success case: deletion of card', async () => {
    const request: CardDeleteRequest = {
      id: existingCards[0]._id.toString(),
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
    expect(mockCardFind).toBeCalledWith(existingCards[0]._id);
    expect(existingCards[0].remove).toBeCalledTimes(1);
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
    expect(res.sendStatus).toBeCalledTimes(0);
  });

  test('Failure case: card those not exist', async () => {
    const request: CardDeleteRequest = {
      id: existingCards[0]._id.toString(),
    };

    // removes card from 'database'
    const deletedCard = existingCards.splice(0);

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
    expect(mockCardFind).toBeCalledWith(deletedCard[0]._id);
    expect(deletedCard[0].remove).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledTimes(0);
  });

  test('Failure case: card is not belonging to user', async () => {
    const request = {
      id: existingCards[1]._id.toString(),
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
      .rejects.toStrictEqual(new HttpStatusError(410));

    expect(mockCardFind).toBeCalledTimes(1);
    expect(mockCardFind).toBeCalledWith(existingCards[1]._id);
    expect(existingCards[1].remove).toBeCalledTimes(0);
    expect(res.sendStatus).toBeCalledTimes(0);
  });
});
