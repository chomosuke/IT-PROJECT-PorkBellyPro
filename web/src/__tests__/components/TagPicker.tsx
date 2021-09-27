import React from 'react';
import { create } from 'react-test-renderer';
import { AppProvider, IAppContext } from '../../AppContext';
import { TagPicker } from '../../components/tagSelector/TagPicker';
import { ICard } from '../../controllers/Card';
import { ITag } from '../../controllers/Tag';

import '../disable-icon-warnings.helpers';

function notImplemented() {
  return new Error('Not Implemented');
}

const demoCard: ICard = {
  company: 'None',
  tags: [],
  email: 'noEmail@jmail.com',
  favorite: false,
  fields: [],
  jobTitle: 'Unemployed',
  name: 'no name',
  phone: '0001',
  update() { throw notImplemented(); },
  commit() { throw notImplemented(); },
  delete() { throw notImplemented(); },
};

const demoTag: ITag = {
  id: '1',
  label: 'Big Boss',
  color: '#BF7829',
  commit() { throw notImplemented(); },
  delete() { throw notImplemented(); },
};

const demoApp: IAppContext = {
  searchQuery: '',
  tagQuery: [],
  user: {
    username: 'username',
    settings: {},
    cards: [demoCard],
    tags: [demoTag],
  },
  update() { throw notImplemented(); },
  showCardDetail() { throw notImplemented(); },
  newCard() { throw notImplemented(); },
  newTag() { throw notImplemented(); },
  login() { return Promise.reject(notImplemented()); },
  logout() { return Promise.reject(notImplemented()); },
};

describe('TagPicker render tests', () => {
  test('TagPicker in editing mode', () => {
    const json = create(
      <AppProvider value={demoApp}>
        <TagPicker targetCard={demoCard} editing />
      </AppProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-Stack css-53"
>
  <div
    className="ms-StackItem css-54"
  >
    Tags
  </div>
  <div
    className="ms-StackItem css-54"
  >
    <div
      className="ms-Stack css-53"
    />
  </div>
  <button
    className="ms-Button ms-Button--default root-55"
    data-is-focusable={true}
    id="picker-target0"
    onClick={[Function]}
    onKeyDown={[Function]}
    onKeyPress={[Function]}
    onKeyUp={[Function]}
    onMouseDown={[Function]}
    onMouseUp={[Function]}
    type="button"
  >
    <span
      className="ms-Button-flexContainer flexContainer-56"
      data-automationid="splitbuttonprimary"
    >
      <span
        className="ms-Button-textContainer textContainer-57"
      >
        <span
          className="ms-Button-label label-59"
          id="id__1"
        >
          Attach Tags
        </span>
      </span>
    </span>
  </button>
</div>
`);
  });

  test('TagPicker in read-only', () => {
    const json = create(
      <AppProvider value={demoApp}>
        <TagPicker targetCard={demoCard} editing={false} />
      </AppProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-Stack css-53"
>
  <div
    className="ms-StackItem css-54"
  >
    Tags
  </div>
  <div
    className="ms-StackItem css-54"
  >
    <div
      className="ms-Stack css-53"
    />
  </div>
</div>
`);
  });
});
