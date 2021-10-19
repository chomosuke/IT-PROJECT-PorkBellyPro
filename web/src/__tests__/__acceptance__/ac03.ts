import {
  text,
} from 'taiko';
import { loginNew } from './preconditions';

test('AC03: Successful login', async () => {
  expect.assertions(2);

  await loginNew();

  // Pass criteria: User is directed to the home page displaying the list of cards they own.
  expect(await text('Search for something...').exists()).toBe(true);
  expect(await text('Add card').exists()).toBe(true);
});
