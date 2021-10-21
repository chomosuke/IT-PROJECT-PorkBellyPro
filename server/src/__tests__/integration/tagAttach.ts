/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import { randomBytes } from 'crypto';
import { MongoClient, ObjectId } from 'mongodb';
import {
  CardPatchRequest, CardPatchResponse, CardPutRequest,
} from '@porkbellypro/crm-shared';
import { IUser } from '../../models/user';
import { ITag } from '../../models/tag';
import {
  domain, putCard, registerAndLogin, useAgentDriver,
} from './agent.helpers';
import { ICard } from '../../models/card';

const ownerData: IUser = {
  username: randomBytes(32).toString('base64'),
  password: randomBytes(8).toString('base64'),
};

const nonOwner: IUser = {
  username: randomBytes(32).toString('base64'),
  password: randomBytes(8).toString('base64'),
};

// tag present on card1
const tagData: Omit<ITag, 'user'> = {
  color: 'Black',
  label: 'Metal',
};

// tag to add to card2
const tagData2: Omit<ITag, 'user'> = {
  color: 'White',
  label: 'Wood',
};

// card information base
const cardData: CardPutRequest = {
  name: 'Tag Player',
  phone: '012456789',
  email: 'taggety@tag.tag.org',
  jobTitle: 'Tagster',
  company: 'Tag Pro LTD.',
  fields: [{ key: 'Tag', value: 'Professional' }],
  tags: [],
};

describe('Tag attachment / detachment tests', () => {
  let agent: request.SuperAgentTest;
  let nonOwnerAgent: request.SuperAgentTest;
  let dbClient: MongoClient;
  let tagId: string;
  let tagId2: string;

  beforeAll(async () => {
    [agent, dbClient] = await useAgentDriver();
    await registerAndLogin(agent, ownerData);
    nonOwnerAgent = request.agent(domain);
    // cards do not belong to nonOwnerAgent
    await registerAndLogin(nonOwnerAgent, nonOwner);

    // associate tag1 to user
    const user = await dbClient.db().collection('users').findOne({ username: ownerData.username });
    const userId = user?._id;
    tagId = (await dbClient.db().collection('tags').insertOne({ ...tagData, user: userId }))
      .insertedId.toString();

    // add tag1 to cardData1
    cardData.tags.push(tagId.toString());

    // associate tag2 to user
    tagId2 = (await dbClient.db().collection('tags').insertOne({ ...tagData2, user: userId })).insertedId.toString();
  });

  afterAll(async () => {
    await dbClient.close();
  });

  test('IN11 - Successful attachment of tags to cards', async () => {
    // clone and put card
    const cardBase = await putCard(agent, cardData);

    // attach tag 1 and tag 2 to card 2
    const tags = [tagId, tagId2];
    const changes: CardPatchRequest = {
      id: cardBase.id,
      tags,
    };

    const res = await agent.patch('/api/card').send(changes);
    expect(res.statusCode).toBe(200);
    const body: CardPatchResponse = JSON.parse(res.text);
    expect(body.tags).toEqual(changes.tags);

    // check in database that new tags are tied
    const cardDoc = await dbClient.db().collection('cards').findOne<ICard>({ _id: new ObjectId(cardBase.id) });

    expect(cardDoc?.tags.length).toBe(2);
    // even checks that they are the other listed in tags
    cardDoc?.tags.forEach((t, index) => {
      expect((t as ObjectId).equals(tags[index])).toBe(true);
    });
  });

  test('IN12 - Unauthorised attachment to non-owned tag to owned card', async () => {
    const cardBase = await putCard(agent, cardData);
    const changes: CardPatchRequest = {
      id: cardBase.id,
      tags: [tagId2],
    };
    await nonOwnerAgent.patch('/api/card').send(changes).expect(401);
    // check that cardBase still has tagId1
    const cardDoc = await dbClient.db().collection('cards').findOne<ICard>({ _id: new ObjectId(cardBase.id) });
    // [tagId1]
    expect(cardDoc?.tags.length).toBe(1);
    expect((cardDoc?.tags[0] as ObjectId).equals(tagId)).toBe(true);
  });

  test('IN11A - Removal of Tags from Card', async () => {
    const cardBase = await putCard(agent, cardData);
    const changes: CardPatchRequest = {
      id: cardBase.id,
      tags: [],
    };
    const res = await agent.patch('/api/card').send(changes);
    expect(res.statusCode).toBe(200);
    expect(((JSON.parse(res.text)) as ICard).tags).toEqual([]);

    const cardDoc = await dbClient.db().collection('cards').findOne<ICard>({ _id: new ObjectId(cardBase.id) });
    expect(cardDoc?.tags.length).toBe(0);
  });
});
