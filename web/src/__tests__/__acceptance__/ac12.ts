import {
  $, click, reload, text,
} from 'taiko';
import { randomString } from './common.helpers';
import {
  createCard, createTag, loginNew, openDetail,
} from './preconditions.helpers';

test('AC12: Successful attachment of tag to card', async () => {
  expect.assertions(3);

  await loginNew();

  const cardName = randomString();
  const tagName = randomString();

  await createCard({ name: cardName });

  await openDetail(cardName);

  await createTag(tagName);

  // Step: User clicks on tag to attach to card
  await click((await text(tagName).elements())[1], { force: true });

  // Clicking on tags display them on the details panel.
  expect((await text(tagName).elements()).length).toBe(4);
  // 4 because the one covered by TagPicker count as one

  // Step: User clicks on the save button
  await click($('#saveButton'));

  // Cards are updated upon clicking the save button.
  expect((await text(tagName).elements()).length).toBe(2);
  // Changes presist
  await reload();
  await openDetail(cardName);
  expect((await text(tagName).elements()).length).toBe(2);
});
