import {
  $, click, reload, text, toRightOf,
} from 'taiko';
import { randomString } from './common.helpers';
import {
  createCard, createTag, loginNew, openDetail,
} from './preconditions.helpers';

test('AC13: Successful detachment of tag to card', async () => {
  expect.assertions(3);

  await loginNew();

  const cardName = randomString();
  const tagName = randomString();

  await createCard({ name: cardName });

  await openDetail(cardName);

  await createTag(tagName);

  // Step: User clicks on tag to attach to card
  await click(text(tagName, toRightOf('Tags')), { force: true });

  // Step: User clicks on the save button
  await click($('#saveButton'));

  // Step: User clicks on edit card button
  await click($('#editButton'));

  // Step: User clicks on the removal button on tag
  await click($('#removeTagButton'));

  // Tag is removed from cardDetail
  expect((await text(tagName).elements()).length).toBe(1);

  // Step: User clicks on the save button
  await click($('#saveButton'));

  // Cards are updated upon clicking the save button.
  expect((await text(tagName).elements()).length).toBe(1);
  // Changes presist
  await reload();
  await openDetail(cardName);
  expect((await text(tagName).elements()).length).toBe(1);
});
