import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { CardPutRequest, CardPutResponse } from '@porkbellypro/crm-shared';
import Jimp from 'jimp';
import md5 from 'md5';
import { cardPut, dataURIPrefix } from '../../../api/authenticated/cardPut';
import { IAuthenticatedRouter } from '../../../api/authenticated/router';
import {
  DeepPartial, mock, mockResponse, mockStartSession,
} from '../../helpers';
import { User } from './auth';
import { mockRequest } from './helpers';
import { HttpStatusError } from '../../../api/HttpStatusError';
import { imageUri } from './imageUri.helpers';
import { IApiRouter } from '../../../api/api-router';

const user = {
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

const cardId = Types.ObjectId().toString();

const tagsFindById = mock((id) => tags.find((t) => t.id === id.toString()));
const cardsCreate = mock(async (obj) => {
  const {
    name,
    phone,
    email,
    jobTitle,
    company,
    fields,
    image,
  } = obj;
  return {
    id: cardId,
    favorite: false,
    user: obj.user,
    name,
    phone,
    email,
    jobTitle,
    company,
    fields,
    image,
    tags: obj.tags.map((id: string) => Types.ObjectId(id)),
  };
});

const routerPartial: DeepPartial<IAuthenticatedRouter> = {
  parent: {
    db: {
      startSession: mockStartSession,
    },
    Tags: {
      findById: tagsFindById,
    },
    Cards: {
      create: cardsCreate,
    },
  },
};
const router = routerPartial as IAuthenticatedRouter;

const resStatus = mock().mockReturnThis();
const resJson = mock().mockReturnThis();

const res = mockResponse({
  status: resStatus,
  json: resJson,
});

const next = mock<NextFunction>();

describe('PUT /api/card unit tests', () => {
  beforeEach(async () => {
    tagsFindById.mockClear();
    cardsCreate.mockClear();
    resStatus.mockClear();
    resJson.mockClear();
    next.mockClear();
  });

  test('Success test: without image', async () => {
    const request: CardPutRequest = {
      name: 'john',
      phone: '021',
      email: 'bla@gmail.com',
      jobTitle: 'person',
      company: 'wollies',
      fields: [
        { key: 'height', value: '10cm' }, { key: 'weight', value: 'fat' },
      ],
      tags: tags.map((t) => t.id),
    };
    const req = mockRequest({
      body: request,
      user,
    });

    await expect(cardPut.implementation.call(router, req, res, next)).resolves.toBeUndefined();

    expect(tagsFindById).toBeCalledTimes(3);
    tags.forEach((tag, i) => {
      expect(tagsFindById).toHaveBeenNthCalledWith(i + 1, Types.ObjectId(tag.id));
    });
    expect(cardsCreate).toBeCalledTimes(1);
    expect(cardsCreate).toBeCalledWith({
      user: user.id,
      name: request.name,
      phone: request.phone,
      email: request.email,
      jobTitle: request.jobTitle,
      company: request.company,
      fields: request.fields,
      tags: request.tags.map((id) => Types.ObjectId(id)),
      image: undefined,
    });
    expect(resStatus).toBeCalledTimes(1);
    expect(resStatus).toBeCalledWith(201);
    expect(resJson).toBeCalledTimes(1);

    const {
      name,
      phone,
      email,
      jobTitle,
      company,
      fields,
    } = request;
    const response: CardPutResponse = {
      id: cardId,
      favorite: false,
      name,
      phone,
      email,
      jobTitle,
      company,
      fields,
      tags: tags.map((t) => t.id),
    };
    expect(resJson).toBeCalledWith(response);

    expect(next).not.toBeCalled();
  });

  test('Success test: with image', async () => {
    const request: CardPutRequest = {
      name: 'john',
      phone: '021',
      email: 'bla@gmail.com',
      jobTitle: 'person',
      company: 'wollies',
      fields: [
        { key: 'height', value: '10cm' }, { key: 'weight', value: 'fat' },
      ],
      tags: tags.map((t) => t.id),
      image: imageUri,
    };
    const req = mockRequest({
      body: request,
      user,
    });

    const imageBuffer = await (
      await Jimp.read(Buffer.from(imageUri.substr(dataURIPrefix.length), 'base64'))
    ).getBufferAsync(Jimp.MIME_JPEG);

    await expect(cardPut.implementation.call(router, req, res, next)).resolves.toBeUndefined();

    expect(tagsFindById).toBeCalledTimes(3);
    tags.forEach((tag, i) => {
      expect(tagsFindById).toHaveBeenNthCalledWith(i + 1, Types.ObjectId(tag.id));
    });
    expect(cardsCreate).toBeCalledTimes(1);
    const image = await (await Jimp.read(Buffer.from(imageUri.substr(dataURIPrefix.length), 'base64')))
      .getBufferAsync(Jimp.MIME_JPEG);
    expect(cardsCreate).toBeCalledWith({
      user: user.id,
      name: request.name,
      phone: request.phone,
      email: request.email,
      jobTitle: request.jobTitle,
      company: request.company,
      fields: request.fields,
      image,
      imageHash: md5(imageBuffer),
      tags: request.tags.map((id) => Types.ObjectId(id)),
    });
    expect(resStatus).toBeCalledTimes(1);
    expect(resStatus).toBeCalledWith(201);
    expect(resJson).toBeCalledTimes(1);

    const {
      name,
      phone,
      email,
      jobTitle,
      company,
      fields,
    } = request;
    const response: CardPutResponse = {
      id: cardId,
      favorite: false,
      name,
      phone,
      email,
      jobTitle,
      company,
      imageHash: md5(imageBuffer),
      fields,
      tags: tags.map((t) => t.id),
    };
    expect(resJson).toBeCalledWith(response);

    expect(next).not.toBeCalled();
  });

  test('Fail test: corrupted image', async () => {
    const request: CardPutRequest = {
      name: 'john',
      phone: '021',
      email: 'bla@gmail.com',
      jobTitle: 'person',
      company: 'wollies',
      fields: [
        { key: 'height', value: '10cm' }, { key: 'weight', value: 'fat' },
      ],
      tags: [],
      // swap last 4 char to simulate corruption
      image: `${imageUri.substr(0, imageUri.length - 4)}oops`,
    };
    const req = mockRequest({
      body: request,
      user,
    });

    await expect(cardPut.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(400));

    expect(tagsFindById).not.toBeCalled();
    expect(cardsCreate).not.toBeCalled();
    expect(resStatus).not.toBeCalled();
    expect(resJson).not.toBeCalled();
    expect(next).not.toBeCalled();
  });

  test('Fail test: bad image content type', async () => {
    const request: CardPutRequest = {
      name: 'john',
      phone: '021',
      email: 'bla@gmail.com',
      jobTitle: 'person',
      company: 'wollies',
      fields: [
        { key: 'height', value: '10cm' }, { key: 'weight', value: 'fat' },
      ],
      tags: [],
      image: `data:text/plain;base64,${imageUri.substr(dataURIPrefix.length, imageUri.length - dataURIPrefix.length)}`,
    };
    const req = mockRequest({
      body: request,
      user,
    });

    await expect(cardPut.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(400));

    expect(tagsFindById).not.toBeCalled();
    expect(cardsCreate).not.toBeCalled();
    expect(resStatus).not.toBeCalled();
    expect(resJson).not.toBeCalled();
    expect(next).not.toBeCalled();
  });

  test('Fail test: bad tagId', async () => {
    const request: CardPutRequest = {
      name: 'john',
      phone: '021',
      email: 'bla@gmail.com',
      jobTitle: 'person',
      company: 'wollies',
      fields: [
        { key: 'height', value: '10cm' }, { key: 'weight', value: 'fat' },
      ],
      tags: [...tags.map((t) => t.id), Types.ObjectId().toString()],
    };
    const req = mockRequest({
      body: request,
      user,
    });

    await expect(cardPut.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(400));

    expect(tagsFindById).toBeCalled();
    expect(cardsCreate).not.toBeCalled();
    expect(resStatus).not.toBeCalled();
    expect(resJson).not.toBeCalled();
    expect(next).not.toBeCalled();
  });

  test('Fail test: tagId wrong user', async () => {
    const tagsWrongUser = tags.map((t) => ({ ...t }));
    tagsWrongUser[2].user = Types.ObjectId();

    const tagsFindByIdWU = mock((id) => tagsWrongUser.find((t) => t.id === id.toString()));

    const { parent } = router;
    const TagsWU = {
      findById: tagsFindByIdWU,
    };

    const routerWUPartial: DeepPartial<IAuthenticatedRouter> = {
      parent: {
        ...parent,
        Tags: TagsWU,
      } as DeepPartial<IApiRouter>,
    };
    const routerWU = routerWUPartial as IAuthenticatedRouter;

    const request: CardPutRequest = {
      name: 'john',
      phone: '021',
      email: 'bla@gmail.com',
      jobTitle: 'person',
      company: 'wollies',
      fields: [
        { key: 'height', value: '10cm' }, { key: 'weight', value: 'fat' },
      ],
      tags: tagsWrongUser.map((t) => t.id),
    };
    const req = mockRequest({
      body: request,
      user,
    });

    await expect(cardPut.implementation.call(routerWU, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(401));

    expect(tagsFindByIdWU).toBeCalled();
    expect(cardsCreate).not.toBeCalled();
    expect(resStatus).not.toBeCalled();
    expect(resJson).not.toBeCalled();
    expect(next).not.toBeCalled();
  });

  test('Fail test: bad request - no email', async () => {
    const request: Partial<CardPutRequest> = {
      name: 'john',
      phone: '021',
      jobTitle: 'person',
      company: 'wollies',
      fields: [
        { key: 'height', value: '10cm' }, { key: 'weight', value: 'fat' },
      ],
      tags: [],
    };
    const req = mockRequest({
      body: request,
      user,
    });

    await expect(cardPut.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(400));

    expect(tagsFindById).not.toBeCalled();
    expect(cardsCreate).not.toBeCalled();
    expect(resStatus).not.toBeCalled();
    expect(resJson).not.toBeCalled();
    expect(next).not.toBeCalled();
  });
});
