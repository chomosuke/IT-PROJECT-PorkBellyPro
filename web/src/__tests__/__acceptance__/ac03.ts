import {
  button, click, focus, text, textBox, write,
} from 'taiko';
import { toRegister } from './ac01';
import { delay, randomString } from './common';

// precondition: register a new account and login
export async function loginNew(): Promise<string> {
  await toRegister();
  const username = randomString();
  const password = randomString();
  await focus(textBox('Username'));
  await write(username);
  await focus(textBox('Password'));
  await write(password);
  await click(button('Register'), { waitForNavigation: false });
  await delay();

  // Step: Enter a username that is already present in the database into the username field
  await focus(textBox('Username'));
  await write(username);

  // Step: Enter the password associated with that username
  await focus(textBox('Password'));
  await write(password);

  // Step: Click login button
  await click(button('Log in'), { waitForNavigation: false });
  await delay();

  return username;
}

test('AC03: Successful login', async () => {
  expect.assertions(2);

  await loginNew();

  // Pass criteria: User is directed to the home page displaying the list of cards they own.
  expect(await text('Search for something...').exists()).toBe(true);
  expect(await text('Add card').exists()).toBe(true);
});
