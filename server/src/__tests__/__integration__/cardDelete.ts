/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import { randomBytes } from 'crypto';
import { MongoClient, ObjectId } from 'mongodb';
import { CardDeleteRequest, CardPutRequest } from '@porkbellypro/crm-shared';
import { IUser } from '../../models/user';
import {
  domain, putCard, registerAndLogin, useAgentDriver,
} from './agent.helpers';

const userData: IUser = {
  username: randomBytes(32).toString('base64'),
  password: randomBytes(8).toString('base64'),
};

const nonOwnerData: IUser = {
  username: randomBytes(32).toString('base64'),
  password: randomBytes(8).toString('base64'),
};

// request with image
const putData: CardPutRequest = {
  name: 'Clear Image',
  phone: '012',
  email: 'life@is.good',
  jobTitle: 'Handyman',
  company: 'wollies',
  fields: [{ key: 'picture', value: 'clear' }],
  tags: [],
};

describe('Card Deletion Tests', () => {
  let agent: request.SuperAgentTest;
  let nonOwner: request.SuperAgentTest;
  let dbClient: MongoClient;

  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    nonOwner = request.agent(domain);
    await registerAndLogin(agent, userData);
    await registerAndLogin(nonOwner, nonOwnerData);
  });

  afterAll(async () => {
    await dbClient.close();
  });

  test('IN15 - Successful deletion of card', async () => {
    // put a new card to delete
    const toDelete = await putCard(agent, putData);
    const req: CardDeleteRequest = {
      id: toDelete.id,
    };
    const res = await agent.delete('/api/card').send(req);
    expect(res.statusCode).toBe(204);

    // check Database
    const noDoc = await dbClient.db().collection('cards').findOne({ _id: new ObjectId(toDelete.id) });
    expect(noDoc).toBeNull();
  });

  test('IN16 - Deletion of card not in database', async () => {
    const deleted = await putCard(agent, putData);
    const res = await dbClient.db().collection('cards').deleteOne({ _id: new ObjectId(deleted.id) });
    expect(res.deletedCount).toBe(1);

    const req : CardDeleteRequest = {
      id: deleted.id,
    };
    await agent.delete('/api/card').send(req).expect(410);
  });

  test('IN17 - Unauthorised Deletion of non-owned card', async () => {
    const card = await putCard(agent, putData);
    const req : CardDeleteRequest = {
      id: card.id,
    };
    await nonOwner.delete('/api/card').send(req).expect(410);
  });
});
