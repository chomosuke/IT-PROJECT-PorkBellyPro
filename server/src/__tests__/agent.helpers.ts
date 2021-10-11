/* eslint-disable max-classes-per-file */
import request from 'supertest';
import { RegisterRequest } from '@porkbellypro/crm-shared';
import cookie from 'cookie';
import { Db } from 'mongodb';

/*
 * ideas for how one may create tests distributed over the files
 * describe blocks are defined here
 * although these functions could alternatively house the logic of each test
 * that will be hooked onto the main test.
 * 
 * registerAndLogin is a helper function to automatically set an instance
 * for the tester. We can use this to create an agent agnostic tester
 * but its test still needs to be synchronous with the main tester file.
 * This calls for the need of JEST exclusion rules for these files
 * so that they are only run through the main process.
 */

// an Imperative style of work
let privateAgent: request.SuperAgentTest;
let db: Db;

// sets agent... to be called inside before all hook
export function setAgent(agent: request.SuperAgentTest, targetDb: Db): void {
  privateAgent = agent;
  db = targetDb;
}

// exports the actual tests
export function agentTests(): void {
  return describe('Agent is passed', () => {
    beforeAll(() => {
      expect(privateAgent).not.toBeUndefined();
      expect(db).not.toBeUndefined();
    });

    test('agent is not undef', () => {
      expect(privateAgent).not.toBeUndefined();
    });
  });
}

/*
 * class of static things so that tests can be called in describe cycle
 * set needs to be called in before All
 */
export class StaticAgentTest {
  private static classAgent: request.SuperAgentTest;

  private static database: Db;

  static set(agent: request.SuperAgentTest, targetDb: Db): void {
    this.classAgent = agent;
    this.database = targetDb;
  }

  static test (): void {
    return describe('Agent Class test', () => {
      beforeAll(() => {
        expect(this.classAgent).not.toBeUndefined();
        expect(this.database).not.toBeUndefined();
      });

      test('agent is not undef', () => {
        expect(this.classAgent).not.toBeUndefined();
      });

      test('Static Me Test', async () => {
        const res = await this.classAgent.get('/api/me');
        expect(res.statusCode).toBe(200);
      });
    });
  }
}

/*
 * tester class using local variables.
 * test call needs to be called inside test block
 */
export class LocalAgentTest {
  private agent: request.SuperAgentTest;

  private database: Db;

  constructor(agent: request.SuperAgentTest, targetDb: Db) {
    this.agent = agent;
    this.database = targetDb;
  }

  /*
   * extracted test logic
   * limited to one 'test' instance
   */
  async test() : Promise<void> {
    // before All
    expect(this.agent).not.toBeUndefined();
    expect(this.database).not.toBeUndefined();

    // test
    const res = await this.agent.get('/api/me');
    expect(res.statusCode).toBe(200);
  }
}

/*
 * helper does the registration and login in one async call
 * agent will be set
 */
export async function registerAndLogin(
  agent: request.SuperAgentTest, body: RegisterRequest,
): Promise<void> {
  await agent.post('/api/register')
    .send(body)
    .expect(201);
  const res = await agent.post('/api/login').send(body).expect(200);
  const cookieObject = cookie.parse(res.get('Set-Cookie')[0]);
  expect(cookieObject).toHaveProperty('token');
  agent.set('Cookie', `token=${cookieObject.token}`);
}
