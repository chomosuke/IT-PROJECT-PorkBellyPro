import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { CardPutRequest, CardPutResponse } from '@porkbellypro/crm-shared';
import Jimp from 'jimp';
import { cardPut, dataURIPrefix } from '../../../api/authenticated/cardPut';
import { IAuthenticatedRouter } from '../../../api/authenticated/router';
import {
  DeepPartial, mock, mockResponse, mockStartSession,
} from '../../helpers';
import { User } from './auth';
import { mockRequest } from './helpers';
import { HttpStatusError } from '../../../api/HttpStatusError';
import { imageUri } from './imageUri';

describe('cardPut unit tests', () => {
  test('Success test: without image', async () => {
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

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {
      parent: {
        db: {
          startSession: mockStartSession,
        },
        Tags: {
          findById: mock((id) => tags.find((t) => t.id === id)),
        },
        Cards: {
          create: mock(async (obj) => {
            const {
              name,
              phone,
              email,
              jobTitle,
              company,
              fields,
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
              tags: obj.tags.map((id: string) => Types.ObjectId(id)),
            };
          }),
        },
      },
    };
    const router = routerPartial as IAuthenticatedRouter;

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

    const res = mockResponse({
      status: mock().mockReturnThis(),
      json: mock().mockReturnThis(),
    });

    const next = mock<NextFunction>();

    await expect(cardPut.implementation.call(router, req, res, next)).resolves.toBeUndefined();

    expect(router.parent.Tags.findById).toBeCalledTimes(3);
    tags.forEach((tag, i) => {
      expect(router.parent.Tags.findById).toHaveBeenNthCalledWith(i + 1, tag.id);
    });
    expect(router.parent.Cards.create).toBeCalledTimes(1);
    expect(router.parent.Cards.create).toBeCalledWith({
      user: user.id,
      name: request.name,
      phone: request.phone,
      email: request.email,
      jobTitle: request.jobTitle,
      company: request.company,
      fields: request.fields,
      tags: request.tags,
    });
    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledTimes(1);

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
      hasImage: false,
      fields,
      tags: tags.map((t) => t.id),
    };
    expect(res.json).toBeCalledWith(response);
  });

  test('Success test: with image', async () => {
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

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {
      parent: {
        db: {
          startSession: mockStartSession,
        },
        Tags: {
          findById: mock((id) => tags.find((t) => t.id === id)),
        },
        Cards: {
          create: mock(async (obj) => {
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
              image,
              fields,
              tags: obj.tags.map((id: string) => Types.ObjectId(id)),
            };
          }),
        },
      },
    };
    const router = routerPartial as IAuthenticatedRouter;

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

    const res = mockResponse({
      status: mock().mockReturnThis(),
      json: mock().mockReturnThis(),
    });

    const next = mock<NextFunction>();

    await expect(cardPut.implementation.call(router, req, res, next)).resolves.toBeUndefined();

    expect(router.parent.Tags.findById).toBeCalledTimes(3);
    tags.forEach((tag, i) => {
      expect(router.parent.Tags.findById).toHaveBeenNthCalledWith(i + 1, tag.id);
    });
    expect(router.parent.Cards.create).toBeCalledTimes(1);
    const image = await (await Jimp.read(Buffer.from(imageUri.substr(dataURIPrefix.length), 'base64')))
      .getBufferAsync(Jimp.MIME_JPEG);
    expect(router.parent.Cards.create).toBeCalledWith({
      user: user.id,
      name: request.name,
      phone: request.phone,
      email: request.email,
      jobTitle: request.jobTitle,
      company: request.company,
      fields: request.fields,
      image,
      tags: request.tags,
    });
    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledTimes(1);

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
      hasImage: true,
      fields,
      tags: tags.map((t) => t.id),
    };
    expect(res.json).toBeCalledWith(response);
  });

  test('Fail test: corrupted image', async () => {
    const user = {
      id: Types.ObjectId().toString(),
    } as User;

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {};
    const router = routerPartial as IAuthenticatedRouter;

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

    const res = mockResponse();

    const next = mock<NextFunction>();

    await expect(cardPut.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(400));
  });

  test('Fail test: bad image content type', async () => {
    const user = {
      id: Types.ObjectId().toString(),
    } as User;

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {};
    const router = routerPartial as IAuthenticatedRouter;

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

    const res = mockResponse();

    const next = mock<NextFunction>();

    await expect(cardPut.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(400));
  });

  test('Fail test: bad tagId', async () => {
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

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {
      parent: {
        db: {
          startSession: mockStartSession,
        },
        Tags: {
          findById: mock((id) => tags.find((t) => t.id === id)),
        },
      },
    };
    const router = routerPartial as IAuthenticatedRouter;

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

    const res = mockResponse();

    const next = mock<NextFunction>();

    await expect(cardPut.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(400));

    expect(router.parent.Tags.findById).toBeCalled();
  });

  test('Fail test: tagId wrong user', async () => {
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
        user: Types.ObjectId(),
        label: 'haha3',
        color: 'fff',
      },
    ];

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {
      parent: {
        db: {
          startSession: mockStartSession,
        },
        Tags: {
          findById: mock((id) => tags.find((t) => t.id === id)),
        },
      },
    };
    const router = routerPartial as IAuthenticatedRouter;

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

    const res = mockResponse();

    const next = mock<NextFunction>();

    await expect(cardPut.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(401));

    expect(router.parent.Tags.findById).toBeCalled();
  });

  test('Fail test: bad request - no email', async () => {
    const user = {
      id: Types.ObjectId().toString(),
    } as User;

    const routerPartial: DeepPartial<IAuthenticatedRouter> = {};
    const router = routerPartial as IAuthenticatedRouter;

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

    const res = mockResponse();

    const next = mock<NextFunction>();

    await expect(cardPut.implementation.call(router, req, res, next))
      .rejects.toStrictEqual(new HttpStatusError(400));
  });
});
