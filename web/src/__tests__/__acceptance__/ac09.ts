import {
  $, click, reload, text,
} from 'taiko';
import { randomString } from './common.helpers';
import { createCard, loginNew, openDetail } from './preconditions.helpers';

test('AC09: Successful deletion of card', async () => {
  expect.assertions(3);

  await loginNew();

  const name = randomString();

  await createCard({ name });

  await openDetail(name);

  // Step: User clicks the card delete button
  await click($('#deleteButton'));

  // Step: User confirms deletion on the confirmation dialog
  await click('Yes, Delete');

  // cardDetail section does not exist.
  expect(await $('detailSection').exists()).toBe(false);
  // card does not exist in home page
  expect(await text(name).exists()).toBe(false);
  // card does not exist in database
  await reload();
  expect(await text(name).exists()).toBe(false);
});
