import {
  $, click, reload, text,
} from 'taiko';
import { randomString } from './common.helpers';
import {
  createCard, createTag, loginNew, openDetail,
} from './preconditions.helpers';

test('AC17: Successful tag deletion with attached tag', async () => {
  expect.assertions(2);

  await loginNew();

  const cardName = randomString();
  const tagName = randomString();

  await createCard({ name: cardName });

  await openDetail(cardName);

  await createTag(tagName);

  // Step: User clicks on tag to attach to card
  await click((await text(tagName).elements())[1], { force: true });

  // Step: User clicks on the save button
  await click($('#saveButton'));

  await click('Add card');

  // Step: User clicks on attach tags button.
  await click($('#attachTagsButton'));

  // Step: User clicks on edit tag for a tag. (there's only one tag)
  await click($('#editTagButton'));

  // Step: User clicks on delete tag button.
  await click('remove tag', { waitForNavigation: false });
  await click('Yes, Delete', { waitForNavigation: false });

  // selected tag is removed from all cards (in this case only one)
  await openDetail(cardName);
  expect(await text(tagName).exists()).toBe(false);
  // change presist
  await reload();
  await openDetail(cardName);
  expect(await text(tagName).exists()).toBe(false);
});
