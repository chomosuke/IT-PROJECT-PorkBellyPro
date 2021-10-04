import { MongoClient } from 'mongodb';
import request from 'supertest';
import { RegisterRequest } from '@porkbellypro/crm-shared';
import { randomBytes } from 'crypto';
import cookie from 'cookie';

const dbpath = 'mongodb://localhost:27017/integrationTests';
let dbClient: MongoClient;

let agent: request.SuperAgentTest;

describe('Test to test workflow setup', () => {
  beforeAll(async () => {
    dbClient = new MongoClient(dbpath);
    await dbClient.connect();
    // console.log(dbClient.db());
    agent = request.agent('http://localhost:8080');

    const collection = await dbClient.db().collection('foobar');
    await collection.insertOne({ something: 'versus' });
  });

  test('register and cookie mod', async () => {
    const username = randomBytes(32).toString('base64');
    const body: RegisterRequest = {
      username,
      password: 'password',
    };
    await agent.post('/api/register')
      .send(body)
      .expect(201);

    let res = await agent.post('/api/login')
      .send(body);

    // extracts only token
    expect(cookie.parse(res.get('Set-Cookie')[0])).toHaveProperty('token');
    const { token } = cookie.parse(res.get('Set-Cookie')[0]);
    agent.set('Cookie', [`token=${token}`]);
    res = await agent.get('/api/me')
      .set('Accept', 'application/json');

    console.log(JSON.parse(res.text));
  });

  afterAll(async () => {
    // await dbClient.db().dropDatabase();
    await dbClient.close();
  });
});
