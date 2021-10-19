import {
  reload, text,
} from 'taiko';
import { randomString } from './common.helpers';
import {
  createCard, createTag, editTag, loginNew, openDetail, openTagPicker,
} from './preconditions.helpers';

test('AC15: Successful tag editing with standalone tag', async () => {
  expect.assertions(4);

  await loginNew();

  const cardName = randomString();
  const tagName = randomString();
  const newTagName = randomString();

  await createCard({ name: cardName });

  await openDetail(cardName);

  await openTagPicker();

  await createTag(tagName);

  await editTag(tagName, newTagName);

  // selected tag is updated
  expect(await text(newTagName).exists()).toBe(true);
  expect(await text(tagName).exists()).toBe(false);
  // change presist
  await reload();
  expect(await text(newTagName).exists()).toBe(true);
  expect(await text(tagName).exists()).toBe(false);
});
