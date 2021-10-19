import {
  $, attach, button, click, fileField, focus, textBox, toRightOf, write,
} from 'taiko';
import { join } from 'path';
import { delay, gotoHome, randomString } from './common';

export async function toRegister(): Promise<void> {
  await gotoHome();
  await click('Register to get started');
}

// Register a new account and login
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

export async function openDetail(name: string): Promise<void> {
  await click(name, { force: true });
}

export interface ICardDetails {
  name: string;
  phone?: string;
  jobTitle?: string;
  image?: string;
}

export async function createCard(cardDetails: ICardDetails): Promise<void> {
  // Step: User clicks the new card button
  await click('Add card');

  const {
    name, phone, jobTitle, image,
  } = cardDetails;

  // Step: User enters the new details of the card
  await write(name, textBox(toRightOf('name')));
  if (phone != null) {
    await write(phone, textBox(toRightOf('phone')));
  }
  if (jobTitle != null) {
    await write(jobTitle, textBox(toRightOf('job title')));
  }
  if (image != null) {
    await attach(join(__dirname, image), fileField({ id: 'upload' }), { force: true });
  }

  // Step: User clicks button to confirms the details
  await click($('#saveButton'));
}
