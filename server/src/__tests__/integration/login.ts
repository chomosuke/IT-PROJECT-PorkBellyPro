import { MongoClient } from 'mongodb';
import request from 'supertest';
import crypto from 'crypto';
import { LoginRequest, RegisterRequest } from '@porkbellypro/crm-shared';
import { CookieAccessInfo } from 'cookiejar';
import {
  domain,
  loginAgent, registerAgent, useAgentDriver,
} from './agent.helpers';

let dbClient: MongoClient;
let agent: request.SuperAgentTest;

const userData: RegisterRequest = {
  username: crypto.randomBytes(32).toString('base64'),
  password: 'specialPassword',
};

describe('Login Tests', () => {
  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    await registerAgent(agent, userData);
  });

  test('IN03 - Successful user login', async () => {
    const res = await loginAgent(agent, userData as LoginRequest);
    expect(res.statusCode).toBe(200);
    const cookie = agent.jar.getCookie('token', new CookieAccessInfo('localhost'));
    expect(cookie).not.toBeUndefined();
  });

  test('IN04 - User login with incorrect credentials: password', async () => {
    // incorrect password
    const incorrect: LoginRequest = {
      username: userData.username,
      password: userData.password.concat('1'),
    };
    const localAgent = request.agent(domain);
    const res = await loginAgent(agent, incorrect);
    expect(res.statusCode).toBe(401);
    expect(localAgent.jar.getCookie('token', new CookieAccessInfo('localhost')))
      .toBeUndefined();
  });

  test('IN04 - User login with incorrect credentials: username', async () => {
    // incorrect username
    const incorrect2: LoginRequest = {
      username: userData.username.substring(0, 31),
      password: userData.password,
    };
    const localAgent = request.agent(domain);
    const res = await loginAgent(agent, incorrect2);
    expect(res.statusCode).toBe(401);
    expect(localAgent.jar.getCookie('token', new CookieAccessInfo('localhost')))
      .toBeUndefined();
  });

  afterAll(async () => {
    await dbClient.close();
  });
});
