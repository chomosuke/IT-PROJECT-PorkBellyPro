/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import { randomBytes } from 'crypto';
import { MongoClient, ObjectId } from 'mongodb';
import {
  CardPatchRequest, CardPatchResponse, CardPutRequest, CardPutResponse,
} from '@porkbellypro/crm-shared';
import { IUser } from '../../models/user';
import { ITag } from '../../models/tag';
import {
  domain, registerAndLogin, useAgentDriver,
} from './agent.helpers';
import { imageUri } from '../api/authenticated/imageUri.helpers';
import { ICard } from '../../models/card';

const userData: IUser = {
  username: randomBytes(32).toString('base64'),
  password: randomBytes(8).toString('base64'),
};

const tagData: Omit<ITag, 'user'> = {
  color: 'Black',
  label: 'Metal',
};

// request with image
const putData: CardPutRequest = {
  name: 'Has Image',
  phone: '012',
  email: 'life@is.good',
  jobTitle: 'Handyman',
  company: 'wollies',
  fields: [{ key: 'picture', value: 'clear' }],
  image: imageUri,
  tags: [],
};

describe('Card Put Tests', () => {
  let agent: request.SuperAgentTest;
  let dbClient: MongoClient;
  let userId: ObjectId;
  let cardId: string;

  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    await registerAndLogin(agent, userData);

    // associate tag to user
    const user = await dbClient.db().collection('users').findOne({ username: userData.username });
    userId = user?._id;
    const tagId = (await dbClient.db().collection<ITag>('tags').insertOne({ ...tagData, user: userId })).insertedId;
    putData.tags.push(tagId.toString());

    /*
     * place a card into the database
     * replay IN07
     */
    const res = await agent.put('/api/card').send(putData);
    expect(res.statusCode).toBe(201);
    cardId = (JSON.parse(res.text) as CardPutResponse).id;
  });

  afterAll(async () => {
    await dbClient.close();
  });

  test('IN09 - Successful updating of card of some fields', async () => {
    /*
     * changes all mandatory fields
     * removes images
     * leaves tags unaffected
     */
    const changes: CardPatchRequest = {
      id: cardId,
      name: 'No Image',
      phone: '+8551245789862',
      email: 'Probably not good',
      jobTitle: 'Mystery Man',
      company: 'Anonymouse',
      fields: [{ key: 'picture', value: 'GONE' }],
      image: null,
    };

    const res = await agent.patch('/api/card').send(changes);
    expect(res.statusCode).toBe(200);
    const body: CardPatchResponse = JSON.parse(res.text);

    // remove image and check against rest
    const { id, image, ...rest } = { ...putData, ...changes };
    expect(body).toMatchObject({ id, ...rest });

    // check in database
    const cardDoc = await dbClient.db().collection<ICard>('cards').findOne({ _id: new ObjectId(cardId) });
    // tags in document are stored as reference ObjectIds
    expect(cardDoc).toMatchObject({
      ...rest,
      image: null,
      imageHash: null,
      tags: rest.tags.map((t) => new ObjectId(t)),
    });
  });

  test('IN10 - Unauthorised updating of non-owned card', async () => {
    const nonOwner: IUser = {
      username: randomBytes(32).toString('base64'),
      password: 'black hat hacker',
    };
    const changes: CardPatchRequest = {
      id: cardId,
      name: 'You have been hacked',
      company: "I don't own this card",
    };

    const localAgent = request.agent(domain);
    // no token attempt
    await localAgent.patch('/api/card').send(changes).expect(401);

    // login as nonOwner
    registerAndLogin(localAgent, nonOwner);
    await localAgent.patch('/api/card').send(changes).expect(401);

    // check in both cases that name is not changed
    const cardDoc = await dbClient.db().collection('cards').findOne<ICard>({ _id: new ObjectId(cardId) });
    expect(cardDoc?.name).not.toEqual(changes.name);
    expect(cardDoc?.company).not.toEqual(changes.company);
  });
});
