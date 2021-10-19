import {
  $, click, reload, text,
} from 'taiko';
import { randomString } from './common.helpers';
import {
  createCard, createTag, loginNew, openDetail,
} from './preconditions.helpers';

test('AC16: Successful tag deletion with standalone tag', async () => {
  expect.assertions(2);

  await loginNew();

  const cardName = randomString();
  const tagName = randomString();

  await createCard({ name: cardName });

  await openDetail(cardName);

  await createTag(tagName);

  // Step: User clicks on edit tag for a tag. (there's only one tag)
  await click($('#editTagButton'));

  // Step: User clicks on delete tag button.
  await click('remove tag', { waitForNavigation: false });
  await click('Yes, Delete', { waitForNavigation: false });

  // selected tag is updated
  expect(await text(tagName).exists()).toBe(false);
  // change presist
  await reload();
  expect(await text(tagName).exists()).toBe(false);
});
