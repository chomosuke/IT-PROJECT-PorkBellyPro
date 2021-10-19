import {
  $, click, text, toRightOf,
} from 'taiko';
import { loginNew } from './ac03';
import { createCard } from './ac06';
import { randomString } from './common';

test('AC05: View card detail', async () => {
  expect.assertions(4);

  await loginNew();

  const names = [randomString(), randomString()];

  await createCard({ name: names[0], phone: randomString(), jobTitle: randomString() });
  await createCard({ name: names[1], phone: randomString(), jobTitle: randomString() });

  // Step: Select any card in the card list
  await click(names[0], { force: true });

  // card section exist
  expect(await $('[class^=\'detailSection\']').exists()).toBe(true);
  expect(await text(names[0], toRightOf('name')).exists()).toBe(true);

  // Step: Select any other card in the list
  await click(names[1], { force: true });

  // replace the panel shown
  expect(await $('[class^=\'detailSection\']').exists()).toBe(true);
  expect(await text(names[1], toRightOf('name')).exists()).toBe(true);
});
