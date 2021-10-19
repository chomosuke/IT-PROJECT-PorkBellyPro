import {
  reload, text,
} from 'taiko';
import { randomString } from './common.helpers';
import {
  createCard, createTag, deleteTag, loginNew, openDetail, openTagPicker,
} from './preconditions.helpers';

test('AC16: Successful tag deletion with standalone tag', async () => {
  expect.assertions(2);

  await loginNew();

  const cardName = randomString();
  const tagName = randomString();

  await createCard({ name: cardName });

  await openDetail(cardName);

  await openTagPicker();

  await createTag(tagName);

  await deleteTag(tagName);

  // selected tag is updated
  expect(await text(tagName).exists()).toBe(false);
  // change presist
  await reload();
  expect(await text(tagName).exists()).toBe(false);
});
