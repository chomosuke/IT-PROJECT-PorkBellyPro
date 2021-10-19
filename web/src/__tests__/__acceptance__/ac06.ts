import {
  $, attach, click, fileField, reload, text, textBox, toRightOf, write,
} from 'taiko';
import { join } from 'path';
import { loginNew } from './ac03';
import { delay, randomString } from './common';

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
  await delay();
}

test('AC06: Successful creation of card', async () => {
  expect.assertions(3);

  await loginNew();

  const name = randomString();

  await createCard({
    name, phone: randomString(), jobTitle: randomString(), image: 'test.jpg',
  });

  // cardDetail section does not exist.
  expect(await $('[class^=\'detailSection\']').exists()).toBe(false);
  // card exist in home page
  expect(await text(name).exists()).toBe(true);
  // card exist in database
  await reload();
  expect(await text(name).exists()).toBe(true);
});
