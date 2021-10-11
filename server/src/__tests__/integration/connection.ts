import { MongoClient } from 'mongodb';
import request from 'supertest';
import { RegisterRequest } from '@porkbellypro/crm-shared';
import { randomBytes } from 'crypto';
import {
  LocalAgentTest, StaticAgentTest, agentTests, registerAndLogin, setAgent,
} from '../agent.helpers';

const dbpath = process.env.DB_TESTING_PATH || 'mongodb://localhost:27017/integrationTests';
const port = process.env.SERVER_PORT || 8080;
let dbClient: MongoClient;

let agent: request.SuperAgentTest;
let localAgentTest : LocalAgentTest;

describe('Test to test workflow setup', () => {
  beforeAll(async () => {
    dbClient = new MongoClient(dbpath);
    await dbClient.connect();
    // console.log(dbClient.db());
    agent = request.agent(`http://localhost:${port}`);

    const collection = dbClient.db().collection('foobar');
    await collection.insertOne({ something: 'versus' });
    setAgent(agent, dbClient.db());
    StaticAgentTest.set(agent, dbClient.db());
    localAgentTest = new LocalAgentTest(agent, dbClient.db());
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

  agentTests();
  StaticAgentTest.test();

  test('Local test', async () => {
    await localAgentTest.test();
  });

  afterAll(async () => {
    // await dbClient.db().dropDatabase();
    await dbClient.close();
  });
});
