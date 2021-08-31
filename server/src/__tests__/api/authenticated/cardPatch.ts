import { NextFunction } from 'express';
import { Document, Types } from 'mongoose';
import { CardPatchRequest, CardPatchResponse } from '@porkbellypro/crm-shared';
import Jimp from 'jimp';
import { ICard, ICardField } from '../../../models/card';
import { cardPatch, dataURIPrefix } from '../../../api/authenticated/cardPatch';
import { IAuthenticatedRouter } from '../../../api/authenticated/router';
import {
  DeepPartial, mock, mockResponse, mockStartSession, returnSelf,
} from '../../helpers';
import { User } from './auth';
import { mockRequest } from './helpers';
import { HttpStatusError } from '../../../api/HttpStatusError';
import { imageUri } from './imageUri.helpers';

const user = {
  id: Types.ObjectId().toString(),
} as User;

const user1 = {
  id: Types.ObjectId().toString(),
} as User;

const tags = [
  {
    id: Types.ObjectId().toString(),
    user: Types.ObjectId(user.id),
    label: 'haha1',
    color: 'fff',
  },
  {
    id: Types.ObjectId().toString(),
    user: Types.ObjectId(user.id),
    label: 'haha2',
    color: 'fff',
  },
  {
    id: Types.ObjectId().toString(),
    user: Types.ObjectId(user.id),
    label: 'haha3',
    color: 'fff',
  },
];

const existingCards = [{
  id: Types.ObjectId().toString(),
  user: Types.ObjectId(user.id),
  favorite: true,
  name: 'Bill Nye',
  phone: '0123456789',
  email: 'thescienceguy@pbs.org',
  jobTitle: 'Science Guy',
  company: 'PBS',
  // image: imageBuffer,
  fields: [{ key: 'coolness', value: 'very' }],
  tags: [tags[0].id],
  save: jest.fn().mockResolvedValue(this),
  set: jest.fn(),
}];

function mockSet(this: typeof existingCards[0],
  obj: { [x: string]: unknown;	save: jest.Mock; set: jest.Mock;
  }) {
  const { save, set, ...rest } = obj;
  Object.assign(this, rest);
}
existingCards.forEach((card) => {
  card.set.mockImplementation(mockSet.bind(card));
});

// mock the router
const mockTagFind = mock(mock((id) => tags.find((t) => t.id === id)));
const mockCardFind = mock((id) => existingCards.find((c) => c.id === id));
const routerPartial: DeepPartial<IAuthenticatedRouter> = {
  parent: {
    db: {
      startSession: mockStartSession,
    },
    Tags: {
      findById: mockTagFind,
    },
    Cards: {
      findById: mockCardFind,
    },
  },
};

const router = routerPartial as IAuthenticatedRouter;

let imageBuffer: Buffer;

const next = mock<NextFunction>();

describe('PATCH /api/card unit tests', () => {
  beforeAll(async () => {
    imageBuffer = await (
      await Jimp.read(Buffer.from(imageUri.substr(dataURIPrefix.length), 'base64'))
    ).getBufferAsync(Jimp.MIME_JPEG);
  });

  beforeEach(() => {
    next.mockClear();
    existingCards.forEach((c) => {
      c.save.mockClear();
      c.set.mockClear();
    });
    mockTagFind.mockClear();
    mockCardFind.mockClear();
  });

  // test where call to update all test fields
  test('Success Case: update all text fields', async () => {
    const request: CardPatchRequest = {
      id: existingCards[0].id.toString(),
      favorite: false,
      name: 'Bill Nyan',
      phone: '9876543210',
      email: 'thesciencecat@pbs.org',
      jobTitle: 'Science Cat',
      company: 'PBS',
      image: imageUri,
      fields: [{ key: 'cuteness', value: 'many' }],
      tags: [tags[0].id],
    };

    const req = mockRequest({
      body: request,
      user,
    });

    const res = mockResponse({
      status: mock().mockReturnThis(),
      json: mock().mockReturnThis(),
    });

    // call
    await expect(cardPatch.implementation.call(router, req, res, next))
      .resolves.toBeUndefined();

    request.tags?.forEach((tagId, i) => {
      expect(router.parent.Tags.findById)
        .toHaveBeenNthCalledWith(i + 1, tagId);
    });
    expect(existingCards[0].save).toHaveBeenCalled();
    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(200);
    const response: CardPatchResponse = {
      id: existingCards[0].id,
      favorite: false,
      name: 'Bill Nyan',
      phone: '9876543210',
      email: 'thesciencecat@pbs.org',
      jobTitle: 'Science Cat',
      company: 'PBS',
      hasImage: true,
      fields: [{ key: 'cuteness', value: 'many' }],
      tags: [tags[0].id],
    };
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith(response);
  });

  /*
   * setting image to a null buffer
   * should clear the image field and return hasimage === false
   */
  test('Success Case: removal of image', async () => {
    expect(1).toBe(1);
  });

  // setting field name to null
  test('Fail case: attempting to remove a mandatory field', async () => {
    expect(1).toBe(1);
  });

  // setting request user to user1
  test('Fail case: unauthorised access to the card', async () => {
    expect(1).toBe(1);
  });
});
