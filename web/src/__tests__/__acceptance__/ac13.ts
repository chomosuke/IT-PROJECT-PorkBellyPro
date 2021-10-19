import {
  $, click, reload, text,
} from 'taiko';
import { randomString } from './common.helpers';
import {
  attachTag,
  createCard, createTag, detachTag, loginNew, openDetail, openTagPicker,
} from './preconditions.helpers';

test('AC13: Successful detachment of tag from card', async () => {
  expect.assertions(3);

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

  // Step: User clicks on edit card button
  await click($('#editButton'));

  await detachTag(tagName);

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
