/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import { randomBytes } from 'crypto';
import { Binary, MongoClient, ObjectId } from 'mongodb';
import { CardPutRequest, CardPutResponse } from '@porkbellypro/crm-shared';
import Jimp from 'jimp';
import { CookieAccessInfo } from 'cookiejar';
import { IUser } from '../../models/user';
import {
  domain, putCard, registerAndLogin, useAgentDriver,
} from './agent.helpers';
import { imageUri } from '../api/authenticated/imageUri.helpers';

// JIMP takes a while
jest.setTimeout(12000);

const userData: IUser = {
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
  image: imageUri,
  tags: [],
};

describe('Card Put Tests', () => {
  let agent: request.SuperAgentTest;
  let dbClient: MongoClient;
  let card: CardPutResponse;

  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    await registerAndLogin(agent, userData);
    card = await putCard(agent, putData);
    expect(card.imageHash).not.toBeUndefined();
  });

  afterAll(async () => {
    await dbClient.close();
  });

  test('IN13 - Retrieval of card image', async () => {
    const hash = card.imageHash;
    const res = await agent.get(`/api/image/${hash}`);
    expect(res.statusCode).toBe(200);

    // get cookie from agent
    const cookie = agent.jar.getCookie('token', new CookieAccessInfo('localhost'));

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const img = await Jimp.read({
      url: `${domain}/api/image/${hash}`,
      headers: { Cookie: cookie?.toString() },
    } as any);
    const imgString = await img.getBase64Async(Jimp.MIME_JPEG);

    // compare this string to that stored
    const cardDoc = await dbClient.db().collection('cards').findOne({ _id: new ObjectId(card.id) });
    expect(cardDoc?.image).not.toBeUndefined();
    const docImageBin : Binary = cardDoc?.image;
    const docImageStr = await (await Jimp.read(docImageBin.buffer)).getBase64Async(Jimp.MIME_JPEG);

    expect(docImageStr).toEqual(imgString);
  });

  test('IN14 - Unauthorised retrieval of card image', async () => {
    const nonOwner = request.agent(domain);
    const hash = card.imageHash;
    await nonOwner.get(`/api/image/${hash}`).expect(401);
  });
});
