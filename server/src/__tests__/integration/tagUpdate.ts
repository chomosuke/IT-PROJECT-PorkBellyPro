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

describe('Card Deletion Tests', () => {
  let agent: request.SuperAgentTest;
  let dbClient: MongoClient;

  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    await registerAndLogin(agent, userData);
  });

  afterAll(async () => {
    await dbClient.close();
  });

  test('IN21 - Successful updating of tag fields', async () => {
    const tag = await putTag(agent, tagData);
    const changeReq: Tag = {
      id: tag.id,
      color: 'blue',
      label: 'zesty panda',
    };

    const res = await agent.patch('/api/tag').send(changeReq);
    expect(res.statusCode).toBe(200);
    const newTag: Tag = JSON.parse(res.text);
    expect(newTag).toMatchObject(changeReq);

    // check effects in db
    const tagDoc = await dbClient.db().collection('tags').findOne<ITag>({ _id: new ObjectId(tag.id) });
    expect(tagDoc).not.toBeNull();
    expect(tagDoc).toMatchObject({ color: changeReq.color, label: changeReq.label });
  });

  test('IN22 - Updating a tag that does not exist on the user', async () => {
    const tag = await putTag(agent, tagData);
    const nonOwner = request.agent(domain);
    await registerAndLogin(nonOwner, nonOwnerData);
    const changeReq: Tag = {
      id: tag.id,
      color: 'black',
      label: 'hacked',
    };
    await nonOwner.patch('/api/tag').send(changeReq).expect(410);
    // check for no effects in db
    const noChange = await dbClient.db().collection('tags').findOne<ITag>({ _id: new ObjectId(tag.id) });
    expect(noChange).toMatchObject<Partial<ITag>>({
      color: tag.color,
      label: tag.label,
    });
  });
});
