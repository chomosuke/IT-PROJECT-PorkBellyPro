import {
  $, click, reload, text,
} from 'taiko';
import { delay, randomString } from './common.helpers';
import {
  attachTag,
  createCard, createTag, deleteTag, loginNew, openDetail, openTagPicker,
} from './preconditions.helpers';

test('AC17: Successful tag deletion with attached tag', async () => {
  expect.assertions(2);

  await loginNew();

  const cardName = randomString();
  const tagName = randomString();

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

  await deleteTag(tagName);
  await delay();

  // selected tag is removed from all cards (in this case only one)
  await openDetail(cardName);
  expect(await text(tagName).exists()).toBe(false);
  // change presist
  await reload();
  await openDetail(cardName);
  expect(await text(tagName).exists()).toBe(false);
});
