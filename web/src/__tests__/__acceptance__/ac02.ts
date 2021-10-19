import {
  button, click, focus, text, textBox, write,
} from 'taiko';
import { toRegister } from './ac01';
import { randomString } from './common';

test('AC02: Failed registration using non-unique username', async () => {
  expect.assertions(1);

  await toRegister();

  // Step: Make a account with a username
  const username = randomString();
  await focus(textBox('Username'));
  await write(username);
  await focus(textBox('Password'));
  await write(randomString());
  await click(button('Register'), { waitForNavigation: false });
  await click('Register to get started');

  // Step: Enter a username that is already present in the database into the username field
  await focus(textBox('Username'));
  await write(username);

  // Step: Enter any password into the password field
  await focus(textBox('Password'));
  await write(randomString());

  // Step: Click register button
  await click(button('Register'), { waitForNavigation: false });

  // Pass criteria: User is shown an error dialog stating the failed registration.
  expect(await text('Your Username has already been taken').exists()).toBe(true);
});
