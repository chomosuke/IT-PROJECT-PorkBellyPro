/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import { randomBytes } from 'crypto';
import { MongoClient, ObjectId } from 'mongodb';
import { MeResponse } from '@porkbellypro/crm-shared';
import { IUser } from '../../models/user';
import { ICard } from '../../models/card';
import { ITag } from '../../models/tag';
import {
  domain, loginAgent, registerAgent, useAgentDriver,
} from './agent.helpers';

const userData: IUser = {
  username: randomBytes(32).toString('base64'),
  password: 'password',
};

const tagData: Omit<ITag, 'user'> = {
  color: 'Black',
  label: 'Metal',
};

// tag id will be populated
const cardData: Omit<ICard, 'user'> = {
  company: 'Jonnie Sings',
  email: 'email@jmail.com',
  favorite: false,
  fields: [{ key: 'Rockman', value: 'Mega' }],
  jobTitle: 'Singer',
  name: 'Bon Jovi',
  phone: '0124578921',
  tags: [],
};

describe('Me endpoint test', () => {
  let dbClient: MongoClient;
  let agent: request.SuperAgentTest;
  let tagId: ObjectId;
  let cardId: ObjectId;

  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    await registerAgent(agent, userData);
    const db = dbClient.db();

    // add tagData and userData
    const user = await db.collection('users').findOne({ username: userData.username });
    tagId = (await db.collection('tags').insertOne({ ...tagData, user: user?._id })).insertedId;

    // set tag id for reference
    cardData.tags.push(tagId);
    cardId = (await db.collection('cards').insertOne({ ...cardData, user: user?._id })).insertedId;
    expect(tagId).toBeTruthy();
    expect(cardId).toBeTruthy();
  });

  test('IN05 - Successful retrieval of user data', async () => {
    await loginAgent(agent, userData);
    const res = await agent.get('/api/me')
      .set('Accept', 'application/json')
      .expect(200);
    const obj: MeResponse = JSON.parse(res.text);
    // check that cards are populated properly
    expect(obj.cards.find((c) => cardId.equals(c.id))).toMatchObject(cardData);

    // check that tags are populated properly
    expect(obj.tags.find((t) => tagId.equals(t.id))).toMatchObject(tagData);
  });

  test('IN06 - Unauthorised request to retrieve user data', async () => {
    const localAgent = request.agent(domain);
    await localAgent.get('/api/me').expect(401);
  });

  afterAll(async () => {
    await dbClient.close();
  });
});
