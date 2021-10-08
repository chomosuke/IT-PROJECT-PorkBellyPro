import {
  button, click, focus, textBox, write,
} from 'taiko';

import './common';

test('AC01: Successful registration', async () => {
  expect.assertions(1);

  await click('Register to get started');
  // Precondition: User is on the registration page

  // Step: Enter a unique username into the username field
  await focus(textBox('Username'));
  await write('a');

  // Step: Enter any password into the password field
  await focus(textBox('Password'));
  await write(' ');

  // Step: Click Register button
  await click(button('Register'));

  // Pass criteria: User is redirected to the login page
  expect(await button('Log in').exists()).toBe(true);
});
