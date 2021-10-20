import {
  $, attach, button, clear, click, fileField, focus, text, textBox, toRightOf, write,
} from 'taiko';
import { join } from 'path';
import { delay, gotoHome, randomString } from './common.helpers';

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
    await delay();
  }

  // Step: User clicks button to confirms the details
  await click($('#saveButton'));
}

// have to have cardDetail already open in non edit mode.
export async function openTagPicker(): Promise<void> {
  // Step: User clicks edit card button
  await click($('#editButton'));

  // Step: User clicks on edit card button
  await click($('#attachTagsButton'));
}

/**
 * have to already have tagPicker open
 * will leave with tagPicker open
 */
export async function createTag(tagName: string): Promise<void> {
  // Step: User enters a new label name in search bar
  await write(tagName, $('[value=\'create new tag\']'));

  // Step: User clicks on new tag button
  await click($('#createTagButton'));
}

/**
 * have to already have tagPicker open
 * will leave with tagPicker open
 */
export async function editTag(tagName: string, newTagName: string): Promise<void> {
  // Step: User clicks on edit tag for a tag. (there's only one tag)
  await click($('#editTagButton', toRightOf(tagName)));

  // Step: User changes the tag's label
  await focus($(`[value='${tagName}']`));
  await clear();
  await write(newTagName);

  // Step: User closes the editing window
  await click('PORKBELLY');
}

/**
 * have to already have tagPicker open
 * will leave with tagPicker open
 */
export async function deleteTag(tagName: string): Promise<void> {
  // Step: User clicks on edit tag for a tag. (there's only one tag)
  await click($('#editTagButton', toRightOf(tagName)));

  // Step: User clicks on delete tag button.
  await click('remove tag', { waitForNavigation: false });
  await click('Yes, Delete', { waitForNavigation: false });
}

/**
 * have to already have tagPicker open
 * will leave with tagPicker open
 */
export async function attachTag(tagName: string): Promise<void> {
  // Step: User clicks on tag to attach to card
  await click(text(tagName, toRightOf('Tags')), { force: true });
}

export async function detachTag(tagName: string): Promise<void> {
  // Step: User clicks on the removal button on tag
  await click($('#removeTagButton', toRightOf(tagName)));
}
