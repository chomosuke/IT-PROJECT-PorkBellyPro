import {
  $, text, toRightOf,
} from 'taiko';
import { randomString } from './common.helpers';
import { createCard, loginNew, openDetail } from './preconditions.helpers';

test('AC05: View card detail', async () => {
  expect.assertions(4);

  await loginNew();

  const names = [randomString(), randomString()];

  await createCard({ name: names[0] });
  await createCard({ name: names[1] });

  // Step: Select any card in the card list
  await openDetail(names[0]);

  // card section exist
  expect(await $('#detailSection').exists()).toBe(true);
  expect(await text(names[0], toRightOf('name')).exists()).toBe(true);

  // Step: Select any other card in the list
  await openDetail(names[1]);

  // replace the panel shown
  expect(await $('#detailSection').exists()).toBe(true);
  expect(await text(names[1], toRightOf('name')).exists()).toBe(true);
});
