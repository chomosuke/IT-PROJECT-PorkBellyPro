import {
  $, click, reload, text, textBox, toRightOf, write,
} from 'taiko';
import { randomString } from './common';
import { createCard, loginNew, openDetail } from './preconditions';

test('AC08: Cancel new card details', async () => {
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
  await click($('[class^=\'deleteImg\']'));
  await click('Yes, Delete');

  // Step: User clicks the save button
  await click($('#cancelButton'));

  // card panel returns to read-only state
  expect(await $('#saveButton').exists()).toBe(false);
  expect(await $('#editButton').exists()).toBe(true);
  // image still exist
  expect(await $('[class^=\'noImageDiv\']').exists()).toBe(false);
  // fields are not updated
  expect(await text(phone).exists()).toBe(false);
  expect(await text(jobTitle).exists()).toBe(false);
  // database is not called
  await reload();
  await openDetail(name);
  expect(await $('[class^=\'noImageDiv\']').exists()).toBe(false);
  expect(await text(phone).exists()).toBe(false);
  expect(await text(jobTitle).exists()).toBe(false);
});
