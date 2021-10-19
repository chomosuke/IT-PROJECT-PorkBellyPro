import {
  $, click, reload, text, textBox, toRightOf, write,
} from 'taiko';
import { loginNew } from './ac03';
import { delay, randomString } from './common';

export interface ICardDetails {
  name: string;
  phone: string;
  jobTitle: string;
}

export async function createCard(cardDetails: ICardDetails): Promise<void> {
  // Step: User clicks the new card button
  await click('Add card');

  // Step: User enters the new details of the card
  await write(cardDetails.name, textBox(toRightOf('name')));
  await write(cardDetails.phone, textBox(toRightOf('phone')));
  await write(cardDetails.jobTitle, textBox(toRightOf('job title')));

  // Step: User clicks button to confirms the details
  await click($('#saveButton'));
  await delay();
}

test('AC06: Successful creation of card', async () => {
  expect.assertions(3);

  await loginNew();

  const name = randomString();
  const phone = randomString();
  const jobTitle = randomString();

  await createCard({ name, phone, jobTitle });

  // cardDetail section does not exist.
  expect(await $('[class^=\'detailSection\']').exists()).toBe(false);
  // card exist in home page
  expect(await text(name).exists()).toBe(true);
  // card exist in database
  await reload();
  expect(await text(name).exists()).toBe(true);
});
