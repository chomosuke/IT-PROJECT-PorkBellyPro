import {
  $,
  clear,
  textBox, toRightOf, write,
} from 'taiko';
import { randomString } from './common.helpers';
import { createCard, loginNew } from './preconditions.helpers';

test('AC10, 11: Keyword search with and without matches', async () => {
  expect.assertions(3);

  await loginNew();

  const keyword = randomString(32);

  // create 10 cards with 5 cards containing keyword
  const len = 5;
  const names = [];
  for (let i = 0; i < len; i += 1) {
    names.push(randomString());
  }
  for (let i = 0; i < len; i += 1) {
    names.push(keyword);
  }
  for (const name of names) { // eslint-disable-line no-restricted-syntax
    await createCard({ name }); // eslint-disable-line no-await-in-loop
  }

  // Step: User enters keywords from a card into the search bar.
  await write(keyword.substring(8, 24), textBox(toRightOf('PORKBELLY')));

  // card list shown is filtered to show only cards that contain those words entered.
  expect((await $('#cardContent').elements()).length).toBe(len);

  // User enters keywords not present on any card in the card list into the search bar
  await write(randomString(), textBox(toRightOf('PORKBELLY')));

  // The card list is filtered, no cards are shown.
  expect((await $('#cardContent').elements()).length).toBe(0);

  // card list returns to original state when search bar is cleared
  await clear();
  expect((await $('#cardContent').elements()).length).toBe(len * 2);
});
