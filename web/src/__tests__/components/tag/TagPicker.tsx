import React from 'react';
import { create } from 'react-test-renderer';
import { AppProvider, IAppContext } from '../../../AppContext';
import { TagPicker } from '../../../components/tag/TagPicker';
import { ICard } from '../../../controllers/Card';
import { ITag } from '../../../controllers/Tag';

import '../../disable-icon-warnings.helpers';

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
  className="ms-Stack css-60"
>
  <span
    className="text-61"
  >
    Tags
  </span>
  <div
    className="ms-StackItem css-62"
  >
    <div>
      <div
        className="ms-Stack css-64"
        id="picker-target0"
      >
        <div
          className="ms-Stack-inner css-63"
        >
          <svg
            className="addButton-54"
            fill="#ffffff"
            height={24}
            onClick={[Function]}
            viewBox="0 0 256 256"
            width={24}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              fill="none"
              height="256"
              width="256"
            />
            <circle
              cx="128"
              cy="128"
              fill="none"
              r="96"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            />
            <line
              fill="none"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
              x1="88"
              x2="168"
              y1="128"
              y2="128"
            />
            <line
              fill="none"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
              x1="128"
              x2="128"
              y1="88"
              y2="168"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
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
  className="ms-Stack css-60"
>
  <span
    className="text-61"
  >
    Tags
  </span>
  <div
    className="ms-StackItem css-62"
  >
    <div>
      <div
        className="ms-Stack css-64"
        id="picker-target1"
      >
        <div
          className="ms-Stack-inner css-63"
        />
      </div>
    </div>
  </div>
</div>
`);
  });
});
