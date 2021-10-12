import { MongoClient } from 'mongodb';
import request from 'supertest';
import { RegisterRequest } from '@porkbellypro/crm-shared';
import { randomBytes } from 'crypto';
import {
  registerAndLogin, useAgentDriver,
} from './agent.helpers';

let dbClient: MongoClient;
let agent: request.SuperAgentTest;

describe('Test to test workflow setup', () => {
  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    const collection = dbClient.db().collection('foobar');
    await collection.insertOne({ something: 'versus' });
  });

  test('register and cookie mod', async () => {
    const username = randomBytes(32).toString('base64');
    const body: RegisterRequest = {
      username,
      password: 'password',
    };
    await registerAndLogin(agent, body);
    const res = await agent.get('/api/me')
      .set('Accept', 'application/json');
    console.log(JSON.parse(res.text));

    const users = dbClient.db().collection('users');
    const doc = await users.findOne({ username }).catch(console.error);
    expect(doc).toBeTruthy();
  });

  afterAll(async () => {
    await dbClient.close();
  });
});
