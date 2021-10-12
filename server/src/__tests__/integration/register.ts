import { MongoClient } from 'mongodb';
import request from 'supertest';
import crypto from 'crypto';
import { RegisterRequest } from '@porkbellypro/crm-shared';
import { IUser } from '../../models/user';
import { registerAgent, useAgentDriver } from './agent.helpers';

let dbClient: MongoClient;
let agent: request.SuperAgentTest;

const conflictingUser: IUser = {
  username: crypto.randomBytes(32).toString('base64'),
  password: crypto.randomBytes(32).toString('base64'),
};

describe('Registration tests', () => {
  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    // add sample into db
    const res = await dbClient.db().collection('users').insertOne(
      conflictingUser,
    );
    expect(res.acknowledged).toBe(true);
  });

  test('IN01 - Successful Registration', async () => {
    const req: RegisterRequest = {
      username: crypto.randomBytes(32).toString('base64'),
      password: 'superPassword',
    };
    const res = await registerAgent(agent, req);
    expect(res.statusCode).toBe(201);

    const insertedUser = await dbClient.db().collection('users')
      .findOne({ username: req.username });
    expect(insertedUser).not.toBeNull();
  });

  test('IN02 - Registration with taken Username', async () => {
    const res = await registerAgent(agent, conflictingUser);
    // ensure we have conflict status
    expect(res.statusCode).toBe(409);
    const docs = dbClient.db().collection('users').find({
      username: conflictingUser.username,
    });
    // ensure document remains
    expect(await docs.count()).toBe(1);
  });

  afterAll(async () => {
    await dbClient.close();
  });
});
