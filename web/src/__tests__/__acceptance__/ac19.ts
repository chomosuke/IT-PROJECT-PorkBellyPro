import {
  $, click, text, within,
} from 'taiko';
import { randomString } from './common.helpers';
import {
  attachTag, createCard, createTag, loginNew, openDetail, openTagPicker,
} from './preconditions.helpers';

test('AC19: Tag filter with matches', async () => {
  expect.assertions(2);

  await loginNew();

  const tagName = randomString();

  const len = 2;
  const cardNames = [];
  for (let i = 0; i < len * 2; i += 1) {
    cardNames.push(randomString());
  }

  /* eslint-disable no-await-in-loop */

  for (let i = 0; i < len * 2; i += 1) {
    await createCard({ name: cardNames[i] });
  }

  // create a tag and attach to half of the card
  await openDetail(cardNames[0]);
  await openTagPicker();
  await createTag(tagName);
  await click($('#cancelButton'));
  for (let i = 0; i < len; i += 1) {
    await openDetail(cardNames[i]);

    await openTagPicker();

    await attachTag(tagName);

    await click($('#saveButton'));
  }

  // attach random tag to the other half of the card
  for (let i = len; i < len * 2; i += 1) {
    await openDetail(cardNames[i]);

    await openTagPicker();

    const newTagName = randomString();

    await createTag(newTagName);

    await attachTag(newTagName);

    await click($('#saveButton'));
  }

  /* eslint-enable no-await-in-loop */

  await click($('#closeButton'));

  // Step: User clicks on tags that belong to some cards on the home page
  await click(tagName);

  // half of the cards will match
  expect((await $('#cardContent').elements()).length).toBe(len);
  // there'll be one tag in the search bar
  expect(await text(tagName, within($('#searchContainer'))).exists()).toBe(true);
});
