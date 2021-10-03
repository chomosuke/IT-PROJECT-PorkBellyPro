import React from 'react';
import { create } from 'react-test-renderer';
import { Tag } from '../../../components/tag/Tag';
import { ITag } from '../../../controllers/Tag';

import '../../disable-icon-warnings.helpers';

function notImplemented() {
  return new Error('Not implemented');
}

describe('Tag component unit tests', () => {
  test('Tag with onRemove function', () => {
    const tag: ITag = {
      id: '1',
      label: 'Tag name',
      color: '#F29057',
      commit() { throw notImplemented(); },
      delete() { throw notImplemented(); },
    };

    const json = create(
      <Tag tag={tag} onClick={() => notImplemented()} onRemove={() => notImplemented()} />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="root-53"
>
  <span
    className="labelSpan-54"
    onClick={[Function]}
  >
    Tag name
  </span>
  <span
    className="rightSpan-55"
    onClick={[Function]}
  >
    <svg
      className="crossIcon-56"
      fill="#ffffff"
      height={16}
      viewBox="0 0 256 256"
      width={16}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        fill="none"
        height="256"
        width="256"
      />
      <line
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
        x1="200"
        x2="56"
        y1="56"
        y2="200"
      />
      <line
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
        x1="200"
        x2="56"
        y1="200"
        y2="56"
      />
    </svg>
  </span>
</div>
`);
  });

  test('Tag without onRemove function', () => {
    const tag: ITag = {
      id: '1',
      label: 'Tag name',
      color: '#F29057',
      commit() { throw notImplemented(); },
      delete() { throw notImplemented(); },
    };

    const json = create(
      <Tag tag={tag} onClick={() => notImplemented()} />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="root-53"
>
  <span
    className="labelSpan-54"
    onClick={[Function]}
  >
    Tag name
  </span>
  <span
    className="rightSpan-57"
  />
</div>
`);
  });
});
