import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { CardPatchRequest, CardPatchResponse } from '@porkbellypro/crm-shared';
import Jimp from 'jimp';
import { cardPatch, dataURIPrefix } from '../../../api/authenticated/cardPatch';
import { IAuthenticatedRouter } from '../../../api/authenticated/router';
import {
  DeepPartial, mock, mockResponse, mockStartSession,
} from '../../helpers';
import { User } from './auth';
import { mockRequest } from './helpers';
import { imageUri } from './imageUri.helpers';
import { HttpStatusError } from '../../../api/HttpStatusError';

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

let imageBuffer: Buffer;

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
  tags: [tags[0].id],
  save: jest.fn().mockResolvedValue(this),
  set: jest.fn(),
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
  save: jest.fn().mockResolvedValue(this),
  set: jest.fn(),
}];

let existingCards = existingCardsConsts.map((card) => ({ ...card }));

function mockSet(this: typeof existingCards[0],
  obj: {
    [x: string]: unknown; save: jest.Mock; set: jest.Mock;
  }) {
  const { save, set, ...rest } = obj;
  Object.assign(this, rest);
}

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

const next = mock<NextFunction>();

describe('PATCH /api/card unit tests', () => {
  beforeAll(async () => {
    imageBuffer = await (
      await Jimp.read(Buffer.from(imageUri.substr(dataURIPrefix.length), 'base64'))
    ).getBufferAsync(Jimp.MIME_JPEG);
  });

  beforeEach(() => {
    next.mockClear();
    existingCardsConsts.forEach((c) => {
      c.save.mockClear();
      c.set.mockClear();
    });
    existingCards = existingCardsConsts.map((card) => ({ ...card }));
    existingCards.forEach((card) => {
      card.set.mockImplementation(mockSet.bind(card));
    });
    mockTagFind.mockClear();
    mockCardFind.mockClear();
  });

  // test where call to update all test fields
  test('Success Case: update all text fields', async () => {
    const request: CardPatchRequest = {
      id: existingCards[0].id,
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
    expect(existingCards[0].set.mock.calls[0][0]).toHaveProperty(
      'image', imageBuffer,
    );
    expect(existingCards[0].image).toEqual(imageBuffer);
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
    existingCards[1].image = imageBuffer;

    const request: CardPatchRequest = {
      id: existingCards[1].id.toString(),
      image: null,
    };

    const req = mockRequest({
      body: request,
      user: user1,
    });

    const res = mockResponse({
      status: mock().mockReturnThis(),
      json: mock().mockReturnThis(),
    });

    await expect(cardPatch.implementation.call(router, req, res, next))
      .resolves.toBeUndefined();

    const response: CardPatchResponse = {
      id: existingCards[1].id,
      favorite: false,
      name: 'Prince Charming',
      phone: '0123456789',
      email: 'noFace@face.clear',
      jobTitle: 'Clean Shaven',
      company: 'FaceClear',
      hasImage: false,
      fields: [],
      tags: [],
    };
    expect(res.status).toBeCalled();
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalled();
    expect(res.json).toBeCalledWith(response);
    expect(existingCards[1].image).toBe(null);
  });

  // setting field name to null
  test('Fail case: attempting to remove a mandatory field', async () => {
    const request = {
      id: existingCards[0].id.toString(),
      name: '',
      favorite: null,
      phone: '',
      email: '',
      jobTitle: '',
      company: '',
      fields: null,
      tags: null,
      image: imageBuffer,
    };
    const req = mockRequest({
      body: request,
      user,
    });

    const res = mockResponse({
      status: mock().mockReturnThis(),
      json: mock().mockReturnThis(),
    });

    await expect(cardPatch.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(400));

    // expect image to not be saved
    expect(existingCards[0].image).toEqual(undefined);
  });

  // setting request user to user1
  test('Fail case: unauthorised access to the card', async () => {
    const request: CardPatchRequest = {
      id: existingCards[0].id,
      favorite: false,
    };
    const req = mockRequest({
      body: request,
      user: user1,
    });

    const res = mockResponse({
      status: mock().mockReturnThis(),
      json: mock().mockReturnThis(),
    });

    await expect(cardPatch.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(401));

    expect(existingCards[0].set).not.toBeCalled();
    expect(existingCards[0].save).not.toBeCalled();
  });
});
