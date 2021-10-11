import {
  button, click, focus, textBox, write,
} from 'taiko';

import { gotoHome, randomString } from './common';

test('AC01: Successful registration', async () => {
  // There is one assertion at the end.
  expect.assertions(1);

  // Precondition: User is on the registration page
  await gotoHome();
  await click('Register to get started');

  // Step: Enter a unique username into the username field
  await focus(textBox('Username'));
  await write(randomString());

  // Step: Enter any password into the password field
  await focus(textBox('Password'));
  await write(randomString());

  // Step: Click Register button
  await click(button('Register'), { waitForNavigation: false });

  // Pass criteria: User is redirected to the login page
  expect(await button('Log in').exists()).toBe(true);
});
