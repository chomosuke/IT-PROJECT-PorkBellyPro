import {
  $, click, text, within,
} from 'taiko';
import { randomString } from './common.helpers';
import {
  attachTag, createCard, createTag, loginNew, openDetail, openTagPicker,
} from './preconditions.helpers';

test('AC20, 21: Tag filter with no matches and removal', async () => {
  expect.assertions(4);

  await loginNew();

  const tagName = randomString();

  const len = 2;
  const cardNames = [];
  for (let i = 0; i < len; i += 1) {
    cardNames.push(randomString());
  }

  /* eslint-disable no-await-in-loop */

  for (let i = 0; i < len; i += 1) {
    await createCard({ name: cardNames[i] });
  }

  // create a tag that is attached to no card
  await openDetail(cardNames[0]);
  await openTagPicker();
  await createTag(tagName);
  await click($('#cancelButton'));

  // attach random tag to all cards
  for (let i = 0; i < len; i += 1) {
    await openDetail(cardNames[i]);

    await openTagPicker();

    const newTagName = randomString();

    await createTag(newTagName);

    await attachTag(newTagName);

    await click($('#saveButton'));
  }

  /* eslint-enable no-await-in-loop */

  await click($('#closeButton'));

  // Step: User clicks on tags that belong to no card
  await click(tagName);

  // tag will match no card
  expect((await $('#cardContent').elements()).length).toBe(0);
  // there'll be one tag in the search bar
  expect(await text(tagName, within($('#searchContainer'))).exists()).toBe(true);

  // AC21

  // Step: User clicks on removal button on the tags in the search bar
  await click($('#removeTagButton', within($('#searchContainer'))));

  // Removed tag disappear from the search bar.
  expect(await text(tagName, within($('#searchContainer'))).exists()).toBe(false);
  // cards will return
  expect((await $('#cardContent').elements()).length).toBe(len);
});
