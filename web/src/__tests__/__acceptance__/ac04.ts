import {
  button, click, focus, text, textBox, write,
} from 'taiko';
import { toRegister } from './preconditions.helpers';
import { delay, gotoHome, randomString } from './common.helpers';

describe('AC04: Failed login with incorrect credentials', () => {
  test('password different from that associated with the user', async () => {
    expect.assertions(1);

    await toRegister();

    // Step: Register an account with a random password.
    const username = randomString();
    await focus(textBox('Username'));
    await write(username);
    await focus(textBox('Password'));
    await write(randomString());
    await click(button('Register'), { waitForNavigation: false });
    await delay();

    // Step: Enter a username that is already present in the database
    await focus(textBox('Username'));
    await write(username);

    // Step: Enter a password different from that associated with the user
    await focus(textBox('Password'));
    await write(randomString());

    // Step: Click login button
    await click(button('Log in'), { waitForNavigation: false });
    await delay();

    // Pass criteria: User being displayed an error dialog stating a failed login
    expect(await text('Incorrect username or password').exists()).toBe(true);
  });

  test('a username that is not registered', async () => {
    expect.assertions(1);

    // Preconditions: User is on the login page
    await gotoHome();

    // Step: Enter a username that has not been registered
    await focus(textBox('Username'));
    await write(randomString());

    // Step: Enter any password
    await focus(textBox('Password'));
    await write(randomString());

    // Step: Click the login button
    await click(button('Log in'), { waitForNavigation: false });
    await delay();

    // Pass criteria: User being displayed an error dialog stating a failed login
    expect(await text('Incorrect username or password').exists()).toBe(true);
  });
});
