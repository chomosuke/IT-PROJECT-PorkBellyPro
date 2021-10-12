/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import { randomBytes } from 'crypto';
import { MongoClient, ObjectId } from 'mongodb';
import { Tag } from '@porkbellypro/crm-shared';
import { IUser } from '../../models/user';
import {
  domain,
  putTag,
  registerAndLogin, useAgentDriver,
} from './agent.helpers';
import { ITag } from '../../models/tag';

const userData: IUser = {
  username: randomBytes(32).toString('base64'),
  password: randomBytes(8).toString('base64'),
};

const nonOwnerData: IUser = {
  username: randomBytes(32).toString('base64'),
  password: randomBytes(8).toString('base64'),
};

const tagData: Omit<Tag, 'id'> = {
  color: 'red',
  label: 'Big Boss',
};

describe('Tag Creation Tests', () => {
  let agent: request.SuperAgentTest;
  let dbClient: MongoClient;

  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    await registerAndLogin(agent, userData);
  });

  afterAll(async () => {
    await dbClient.close();
  });

  test('IN18 - Successful creation of tag', async () => {
    const res = await putTag(agent, tagData);

    const tagId = res.id;

    // check in DB
    const tagDoc = await dbClient.db().collection('tags').findOne<ITag>({ _id: new ObjectId(tagId) });
    expect(tagDoc).not.toBeNull();
    expect(tagDoc).toMatchObject(tagData);

    // check user association
    const user = await dbClient.db().collection('users').findOne({ username: userData.username });
    expect(user?._id).toEqual(tagDoc?.user);
  });

  test('IN19 - Creation of tag with missing field', async () => {
    const incomplete = {
      color: tagData.color,
    };
    const localAgent = request.agent(domain);
    await registerAndLogin(localAgent, nonOwnerData);
    // for a new user  -- using agent 2
    await agent.put('/api/tag').send(incomplete).expect(400);

    // check that tag is not created
    const user = await dbClient.db().collection('users').findOne({ username: nonOwnerData.username });
    expect(user?._id).not.toBeUndefined();
    const noTag = await dbClient.db().collection('tags').findOne({ user: user?._id });
    expect(noTag).toBeNull();
  });

  test('IN20 - Unauthorised creation of tag (missing user)', async () => {
    const localAgent = request.agent(domain);
    await localAgent.put('/api/tag').send(tagData).expect(401);
  });
});
