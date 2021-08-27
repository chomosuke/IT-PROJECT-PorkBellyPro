import { Response } from 'express';
import { CallbackError, Mongoose } from 'mongoose';
import { IApiRouter } from '../../api/api-router';
import {
  CardDeleteRequest, deleteCard,
} from '../../api/card-api';
import { ICard, cardSchema } from '../../models/card';
import { IUser } from '../../models/user';
import {
  bindHandler, mock, mockRequest, mockResponse, next, returnSelf,
} from '../helpers';

const mongoose = new Mongoose();

const existingCardDetails: ICard = {
  name: 'Jonathan',
  company: 'Saw Boat',
  email: 'isawedthisboat@in.half',
  favorite: true,
  jobTitle: 'Boat Maker',
  fields: [],
  tags: [],
  phone: '080808808',
};

// saveable interface to mock user.save() mongoose call
interface Savable {
  save: jest.Mock;
}

const dummyuser: IUser & Savable = {
  username: 'PillipSwift',
  password: 'FlexTapeHashed',
  tags: [],
  cards: [],
  save: <jest.Mock>(() => { }),
};

// create a model document to place inside user
const CardModel = mongoose.model<ICard>('Card', cardSchema);
const existingCard = new CardModel({ ...existingCardDetails });
const cardId: string = existingCard.id;

/*
 * card details for PATCH and PUT
 * const newCardDetails: Card = {
 *   id: cardId,
 *   favorite: true,
 *   name: 'Simon',
 *   phone: '12121212',
 *   email: 'knife@buy.from',
 *   jobTitle: 'Knife Supplier',
 *   company: 'Knife',
 *   fields: [],
 *   tags: [],
 * };
 */

const res = mockResponse({
  status: mock<Response['status']>(returnSelf),
  send: mock<Response['send']>(returnSelf),
});

// mock the Cards.
const router: Partial<IApiRouter> = {
  Cards: CardModel,
};

/*
 * targetting specifically one overload of save
 * save with callback
 */
dummyuser.save = jest.fn(
  (callback?: (error?: CallbackError, result?: IUser) => void | undefined) => {
    if (callback) callback(null, dummyuser);
  },
);

describe('Card CRUD Endpoint Tests', () => {
  beforeEach(() => {
    // setup each request and response object
    dummyuser.save.mockClear();
  });

  test('delete card', () => {
    // push card into user
    dummyuser.cards.push(existingCard);
    const deleteRequest: CardDeleteRequest = {
      id: cardId,
    };

    const req = mockRequest({
      body: {
        user: dummyuser,
        ...deleteRequest,
      },
    });
    const fn = bindHandler(router, deleteCard);
    fn(req, res, next);

    expect(res.status).toBeCalledWith(204);
    expect(dummyuser.cards.includes(existingCard)).toBe(false);
  });
});
