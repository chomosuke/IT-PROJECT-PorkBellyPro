import {
  $, clear, click, focus, reload, text, write,
} from 'taiko';
import { randomString } from './common.helpers';
import {
  createCard, createTag, loginNew, openDetail,
} from './preconditions.helpers';

test('AC15: Successful tag editing with standalone tag', async () => {
  expect.assertions(4);

  await loginNew();

  const cardName = randomString();
  const tagName = randomString();
  const newTagName = randomString();

  await createCard({ name: cardName });

  await openDetail(cardName);

  await createTag(tagName);

  // Step: User clicks on edit tag for a tag. (there's only one tag)
  await click($('#editTagButton'));

  // Step: User changes the tag's label
  await focus($(`[value='${tagName}']`));
  await clear();
  await write(newTagName);

  // Step: User closes the editing window
  await click('PORKBELLY');

  // selected tag is updated
  expect(await text(newTagName).exists()).toBe(true);
  expect(await text(tagName).exists()).toBe(false);
  // change presist
  await reload();
  expect(await text(newTagName).exists()).toBe(true);
  expect(await text(tagName).exists()).toBe(false);
});
