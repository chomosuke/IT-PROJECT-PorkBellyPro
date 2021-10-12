import {
  button, click, focus, text, textBox, write,
} from 'taiko';
import { delay, gotoHome, randomString } from './common';

test('AC03: Successful login', async () => {
  expect.assertions(2);

  // Precondition: User is on the login page
  await gotoHome();
  await click('Register to get started');
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

  // Pass criteria: User is directed to the home page displaying the list of cards they own.
  expect(await text('Search for something...').exists()).toBe(true);
  expect(await text('Add card').exists()).toBe(true);
});
