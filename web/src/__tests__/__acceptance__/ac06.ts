import {
  $, reload, text,
} from 'taiko';
import { randomString } from './common';
import { createCard, loginNew } from './preconditions';

test('AC06: Successful creation of card', async () => {
  expect.assertions(3);

  await loginNew();

  const name = randomString();

  await createCard({
    name, phone: randomString(), jobTitle: randomString(), image: 'test.jpg',
  });

  // cardDetail section does not exist.
  expect(await $('[class^=\'detailSection\']').exists()).toBe(false);
  // card exist in home page
  expect(await text(name).exists()).toBe(true);
  // card exist in database
  await reload();
  expect(await text(name).exists()).toBe(true);
});