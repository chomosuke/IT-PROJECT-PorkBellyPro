import {
  $, click, reload, text, textBox, toRightOf, write,
} from 'taiko';
import { randomString } from './common.helpers';
import { createCard, loginNew, openDetail } from './preconditions.helpers';

test('AC07: Successful editing of card details', async () => {
  expect.assertions(8);

  await loginNew();

  const name = randomString();
  const phone = randomString();
  const jobTitle = randomString();

  await createCard({ name, image: 'test.jpg' });

  await openDetail(name);

  // Step: User clicks edit card button
  await click($('#editButton'));

  // Step: User changes some of the field values of the card
  await write(phone, textBox(toRightOf('phone')));
  await write(jobTitle, textBox(toRightOf('job title')));

  // Step: User removes the image of the card
  await click($('#deleteImg'));
  await click('Yes, Delete');

  // Step: User clicks the save button
  await click($('#saveButton'));

  // card panel returns to read-only state
  expect(await $('#saveButton').exists()).toBe(false);
  expect(await $('#editButton').exists()).toBe(true);
  // image no longer exist
  expect(await text('no image').exists()).toBe(true);
  // fields are updated
  expect(await text(phone).exists()).toBe(true);
  expect(await text(jobTitle).exists()).toBe(true);
  // card updated in database
  await reload();
  await openDetail(name);
  expect(await text('no image').exists()).toBe(true);
  expect(await text(phone).exists()).toBe(true);
  expect(await text(jobTitle).exists()).toBe(true);
});
