import { MongoClient } from 'mongodb';
import request from 'supertest';
import crypto from 'crypto';
import { RegisterRequest } from '@porkbellypro/crm-shared';
import cookie from 'cookie';
import {
  registerAndLogin, useAgentDriver,
} from './agent.helpers';

let dbClient: MongoClient;
let agent: request.SuperAgentTest;

const userData: RegisterRequest = {
  username: crypto.randomBytes(32).toString('base64'),
  password: 'specialPassword',
};

describe('Logout Test', () => {
  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    await registerAndLogin(agent, userData);
  });

  test('IN25 - Successful logout', async () => {
    const res = await agent.post('/api/logout');
    expect(res.statusCode).toBe(200);
    expect(res.get('Set-Cookie')[0]).not.toBeNull();
    const cookieObj = cookie.parse(res.get('Set-Cookie')[0]);
    expect(cookieObj).toHaveProperty('token');
    expect(cookieObj.token).toBe('');
  });

  afterAll(async () => {
    await dbClient.close();
  });
});
