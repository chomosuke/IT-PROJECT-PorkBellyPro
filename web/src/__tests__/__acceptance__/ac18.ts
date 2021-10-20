import {
  $, click, reload, text,
} from 'taiko';
import { randomString } from './common.helpers';
import {
  attachTag,
  createCard, createTag, editTag, loginNew, openDetail, openTagPicker,
} from './preconditions.helpers';

test('AC18: Successful tag editing with attached tag', async () => {
  expect.assertions(4);

  await loginNew();

  const cardName = randomString();
  const tagName = randomString();
  const newTagName = randomString();

  await createCard({ name: cardName });

  await openDetail(cardName);

  await openTagPicker();

  await createTag(tagName);

  await attachTag(tagName);

  // Step: User clicks on the save button
  await click($('#saveButton'));

  await click('Add card');

  // Step: User clicks on attach tags button.
  await click($('#attachTagsButton'));

  await editTag(tagName, newTagName);

  // selected tag is updated
  expect(await text(newTagName).exists()).toBe(true);
  expect(await text(tagName).exists()).toBe(false);
  // change presist
  await reload();
  expect(await text(newTagName).exists()).toBe(true);
  expect(await text(tagName).exists()).toBe(false);
});
