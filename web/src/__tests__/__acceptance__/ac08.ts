import {
  $, click, reload, text, textBox, toRightOf, write,
} from 'taiko';
import { randomString } from './common.helpers';
import { createCard, loginNew, openDetail } from './preconditions.helpers';

test('AC08: Cancel new card details', async () => {
  expect.assertions(8);

  await loginNew();

  const name = randomString();
  const phone = randomString();
  const jobTitle = randomString();

  await createCard({
    name, phone, jobTitle, image: 'test.jpg',
  });

  await openDetail(name);

  // Step: User clicks edit card button
  await click($('#editButton'));

  // Step: User changes some of the field values of the card
  await write(randomString(), textBox(toRightOf('phone')));
  await write(randomString(), textBox(toRightOf('job title')));

  // Step: User removes the image of the card
  await click($('#deleteImg'));
  await click('Yes, Delete');

  // Step: User clicks the save button
  await click($('#cancelButton'));

  // card panel returns to read-only state
  expect(await $('#saveButton').exists()).toBe(false);
  expect(await $('#editButton').exists()).toBe(true);
  // image still exist
  expect(await text('no image').exists()).toBe(false);
  // fields are not updated
  expect(await text(phone).exists()).toBe(true);
  expect(await text(jobTitle).exists()).toBe(true);
  // database is not called
  await reload();
  await openDetail(name);
  expect(await text('no image').exists()).toBe(false);
  expect(await text(phone).exists()).toBe(true);
  expect(await text(jobTitle).exists()).toBe(true);
});
