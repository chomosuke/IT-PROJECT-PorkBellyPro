import { reload, text } from 'taiko';
import { randomString } from './common.helpers';
import {
  createCard, createTag, loginNew, openDetail,
} from './preconditions.helpers';

test('AC14: Successful tag creation', async () => {
  expect.assertions(2);

  await loginNew();

  const cardName = randomString();
  const tagName = randomString();

  await createCard({ name: cardName });

  await openDetail(cardName);

  await createTag(tagName);

  // show up in tagList and tagPicker
  expect((await text(tagName).elements()).length).toBe(2);
  // persist
  await reload();
  expect(await text(tagName).exists()).toBe(true);
});
