/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import { randomBytes } from 'crypto';
import { MongoClient, ObjectId } from 'mongodb';
import { CardPutRequest, CardPutResponse } from '@porkbellypro/crm-shared';
import { IUser } from '../../models/user';
import { ITag } from '../../models/tag';
import {
  domain, registerAndLogin, useAgentDriver,
} from './agent.helpers';
import { imageUri } from '../api/authenticated/imageUri.helpers';

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
  name: 'Clear Image',
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

  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    await registerAndLogin(agent, userData);

    // associate tag to user
    const user = await dbClient.db().collection('users').findOne({ username: userData.username });
    userId = user?._id;
    const tagId = (await dbClient.db().collection<ITag>('tags').insertOne({ ...tagData, user: userId })).insertedId;
    putData.tags.push(tagId.toString());
  });

  afterAll(async () => {
    await dbClient.close();
  });

  test('IN07 - Successful creation of card', async () => {
    const res = await agent.put('/api/card').send(putData);
    expect(res.statusCode).toBe(201);
    const body: CardPutResponse = JSON.parse(res.text);
    const { image, ...rest } = putData;

    // expects that tags are NOT populated
    expect(body).toMatchObject(rest);

    // check that card in database is associated with user
    const query = dbClient.db().collection('cards').find({ user: userId, _id: new ObjectId(body.id) });
    expect(await query.count()).toBe(1);
  });

  test('IN08 - Creation of card with missing mandatory field data', async () => {
    // create new user to have fresh card count
    const local: IUser = {
      username: randomBytes(32).toString('base64'),
      password: randomBytes(8).toString('base64'),
    };
    const localAgent = request.agent(domain);
    await registerAndLogin(localAgent, local);

    // remove image from original data
    const { image, ...rest } = putData;
    rest.tags = [];

    // rest contains manadatory fields that we'll remove one field at a time
    Object.keys(rest).forEach((takeAway) => {
      // construct request with w/out takeAway field
      const missingFields = Object.fromEntries(
        Object.entries(rest).filter(([key]) => key !== takeAway),
      );

      localAgent.put('/api/card').send(missingFields).expect(400);
    });

    // check that local user has no card
    const userDoc = await dbClient.db().collection('users').findOne({ username: local.username });
    expect(await dbClient.db().collection('cards').find({ user: userDoc?._id }).count()).toBe(0);
  });
});
