import React from 'react';
import { create } from 'react-test-renderer';
import { CardDetailActions } from '../../../components/cardDetails/CardDetailActions';
import { HomeProvider, IHomeContext } from '../../../HomeContext';

function onBeginEdit() {}
function onSave() {}
function onCancel() {}
function onDelete() {}

function notImplemented() {
  return new Error('Not implemented');
}

const getHome: (expanded: boolean) => IHomeContext = (expanded: boolean) => ({
  cardDetailExpanded: expanded,
  expandCardDetail() { throw notImplemented(); },
  lockCard() { throw notImplemented(); },
  unlockCard() { throw notImplemented(); },
  unlockCardLater() { throw notImplemented(); },
});

describe('CardDetailActions unit tests', () => {
  test('existing card viewing expanded', () => {
    const json = create(
      <HomeProvider value={getHome(true)}>
        <CardDetailActions
          editing={false}
          newCard={false}
          onBeginEdit={onBeginEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </HomeProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot();
  });

  test('existing card editing expanded', () => {
    const json = create(
      <HomeProvider value={getHome(true)}>
        <CardDetailActions
          editing
          newCard={false}
          onBeginEdit={onBeginEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </HomeProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot();
  });

  test('new card viewing expanded', () => {
    const json = create(
      <HomeProvider value={getHome(true)}>
        <CardDetailActions
          editing={false}
          newCard
          onBeginEdit={onBeginEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </HomeProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot();
  });

  test('new card editing expanded', () => {
    const json = create(
      <HomeProvider value={getHome(true)}>
        <CardDetailActions
          editing
          newCard
          onBeginEdit={onBeginEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </HomeProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot();
  });

  test('existing card viewing collapsed', () => {
    const json = create(
      <HomeProvider value={getHome(false)}>
        <CardDetailActions
          editing={false}
          newCard={false}
          onBeginEdit={onBeginEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </HomeProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot();
  });

  test('existing card editing collapsed', () => {
    const json = create(
      <HomeProvider value={getHome(false)}>
        <CardDetailActions
          editing
          newCard={false}
          onBeginEdit={onBeginEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </HomeProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot();
  });

  test('new card viewing collapsed', () => {
    const json = create(
      <HomeProvider value={getHome(false)}>
        <CardDetailActions
          editing={false}
          newCard
          onBeginEdit={onBeginEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </HomeProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot();
  });

  test('new card editing collapsed', () => {
    const json = create(
      <HomeProvider value={getHome(false)}>
        <CardDetailActions
          editing
          newCard
          onBeginEdit={onBeginEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </HomeProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot();
  });
});
