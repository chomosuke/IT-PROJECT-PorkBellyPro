/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import { randomBytes } from 'crypto';
import { MongoClient, ObjectId } from 'mongodb';
import { CardPutRequest, Tag } from '@porkbellypro/crm-shared';
import { IUser } from '../../models/user';
import {
  domain,
  putCard,
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

const cardPutData: CardPutRequest = {
  name: 'Tagster',
  phone: '1800TAGS',
  email: 'I.heart@tags.com',
  jobTitle: 'TagPro',
  company: 'Tagsters',
  fields: [],
  tags: [],
};

describe('Tag Deletion Tests', () => {
  let agent: request.SuperAgentTest;
  let dbClient: MongoClient;

  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    await registerAndLogin(agent, userData);
  });

  afterAll(async () => {
    await dbClient.close();
  });

  test('IN23 - Successful deletion of tag', async () => {
    // precondition, need a card attached with a tag on db
    const tag = await putTag(agent, tagData);
    const cardCopyData = { ...cardPutData };
    cardCopyData.tags.push(tag.id);

    // generate a set of cards to check tag removal upon deletion
    let cards = [];
    const nClones = 5;
    for (let i = 0; i < nClones; i += 1) {
      const card = putCard(agent, cardCopyData);
      cards.push(card);
    }

    cards = await Promise.all(cards);

    // check that cards have been associated
    let count = await dbClient.db().collection('cards').countDocuments(
      { tags: { $all: [new ObjectId(tag.id)] } },
    );
    expect(count).toBe(nClones);

    // call deletion
    const req: Pick<Tag, 'id'> = { id: tag.id };
    await agent.delete('/api/tag').send(req).expect(200);

    // check that no cards are associated anymore
    count = await dbClient.db().collection('cards').countDocuments(
      { tags: { $all: [new ObjectId(tag.id)] } },
    );
    expect(count).toBe(0);
  });

  test('IN24 - Deleting a tag that does not exist on the user', async () => {
    const tag = await putTag(agent, tagData);
    const nonOwner = request.agent(domain);
    await registerAndLogin(nonOwner, nonOwnerData);
    // try to delete agent's tag
    const req : Pick<Tag, 'id'> = { id: tag.id };
    await nonOwner.delete('/api/tag').send(req).expect(410);

    // check that tag is still there
    const tagDoc = await dbClient.db().collection('tags').findOne({ _id: new ObjectId(tag.id) });
    expect(tagDoc).not.toBeNull();
    expect(tagDoc).toMatchObject<Partial<ITag>>({
      color: tag.color,
      label: tag.label,
    });
  });
});
