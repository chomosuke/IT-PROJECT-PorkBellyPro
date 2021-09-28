import React from 'react';
import { create } from 'react-test-renderer';
import { CardImageField } from '../../../components/cardDetails/CardImageField';
import { ICard } from '../../../controllers/Card';

function notImplemented() {
  return new Error('Not Implemented');
}

const getCard: (image: boolean) => ICard = (image: boolean) => ({
  company: 'None',
  tags: [],
  email: 'noEmail@jmail.com',
  favorite: false,
  fields: [],
  jobTitle: 'Unemployed',
  name: 'no name',
  phone: '0001',
  ...(image
    ? {
      image: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    }
    : {}),
  update() { throw notImplemented(); },
  commit() { throw notImplemented(); },
  delete() { throw notImplemented(); },
});

describe('CardImageField unit tests', () => {
  test('card with image editing', () => {
    const json = create(
      <CardImageField
        card={getCard(true)}
        editing
      />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot();
  });
  test('card with image viewing', () => {
    const json = create(
      <CardImageField
        card={getCard(true)}
        editing={false}
      />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot();
  });
  test('card without image editing', () => {
    const json = create(
      <CardImageField
        card={getCard(false)}
        editing
      />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot();
  });
  test('card without image viewing', () => {
    const json = create(
      <CardImageField
        card={getCard(false)}
        editing={false}
      />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot();
  });
});
