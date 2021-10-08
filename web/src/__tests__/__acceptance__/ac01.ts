import {
  button, click, focus, textBox, write,
} from 'taiko';

import { gotoHome, interceptRequests } from './common';

test('AC01: Successful registration', async () => {
  // There is one assertion at the end.
  expect.assertions(1);

  /*
   * Optional: Intercept fetches to mock server responses.
   * Skip the call to interceptRequests if your test is intended to run against a real server
   * instance.
   */
  const reRegister = /^\/register$/i;
  await interceptRequests(async (respond, request) => {
    const match = reRegister.exec(request.url);
    // No route match, return false to indicate route is not handled.
    if (match == null) return false;

    if (request.hasPostData && request.postData != null) {
      let body;
      try {
        body = JSON.parse(request.postData);
      } catch { } // eslint-disable-line no-empty
      if (body != null) {
        const { username, password } = body;
        if (typeof username === 'string'
          && typeof password === 'string') {
          await respond({ status: 201 });
          return true;
        }
      }
    }

    await respond({ status: 400 });
    return true;
  });

  // Precondition: User is on the registration page
  await gotoHome();
  await click('Register to get started');

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
