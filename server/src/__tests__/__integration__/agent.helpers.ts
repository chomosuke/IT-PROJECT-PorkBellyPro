/* eslint-disable max-classes-per-file */
import request from 'supertest';
import {
  CardPutRequest, CardPutResponse, LoginRequest, RegisterRequest, Tag,
} from '@porkbellypro/crm-shared';
import cookie from 'cookie';
import { MongoClient } from 'mongodb';

const dbpath = process.env.DB_TESTING_PATH || 'mongodb://localhost:27017/integrationTests';
const port = process.env.SERVER_PORT || 8080;
export const domain = `http://localhost:${port.toString()}`;

// return agent and client with connection
export async function useAgentDriver(): Promise<[request.SuperAgentTest, MongoClient]> {
  const dbClient = new MongoClient(dbpath);
  await dbClient.connect();
  const agent = request.agent(domain);
  return [agent, dbClient];
}

// to be used in IN01, IN02
export async function registerAgent(
  agent: request.SuperAgentTest, body: RegisterRequest,
): Promise<request.Response> {
  return agent.post('/api/register')
    .send(body);
}

// to be used in IN03, IN04
export async function loginAgent(
  agent: request.SuperAgentTest, body: LoginRequest,
): Promise<request.Response> {
  const res = await agent.post('/api/login').send(body);

  if (res.ok && res.get('Set-Cookie')[0]) {
    const cookieObject = cookie.parse(res.get('Set-Cookie')[0]);
    expect(cookieObject).toHaveProperty('token');
    agent.jar.setCookie(`token=${cookieObject.token}`);
  }

  return res;
}

/*
 * helper does the registration and login in one async call
 * agent will be set
 */
export async function registerAndLogin(
  agent: request.SuperAgentTest, body: RegisterRequest,
): Promise<void> {
  let res = await registerAgent(agent, body);
  expect(res.statusCode).toBe(201);
  res = await loginAgent(agent, body);
  expect(res.statusCode).toBe(200);
}

/*
 * helper just pushes the card to the backend
 * card will be associated with the user as a result
 * assumes that agent is logged in
 * assumes that data is well-formed
 * Primarily tested with IN07
 */
export async function putCard(
  agent: request.SuperAgentTest, data: CardPutRequest,
): Promise<CardPutResponse> {
  // using agent, push a new card into the database and return card
  const res = await agent.put('/api/card').send(data);
  expect(res.statusCode).toBe(201);
  return JSON.parse(res.text);
}

/*
 * helper just pushes the tag to the backend
 * tag will be associated with the user as a result
 * assumes that agent is logged in
 * assumes that data is well-formed
 * Primarily tested with IN18
 */
export async function putTag(
  agent: request.SuperAgentTest, data: Omit<Tag, 'id'>,
): Promise<Tag> {
  const res = await agent.put('/api/tag').send(data);
  expect(res.statusCode).toBe(201);
  return JSON.parse(res.text);
}
